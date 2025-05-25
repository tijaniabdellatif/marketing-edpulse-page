import axios from 'axios';
import prisma from '@/lib/prisma';
import { EmailService } from '@/server/emails/email.service';
import { 
  Visitor, 
  Session, 
  FormSubmission, 
  Interest,
  Preference,
  InterestType,
  PreferenceType,
  Occupation,
  SubmissionStatus
} from '@prisma/client';

/**
 * Type for visitor with related models
 */
type VisitorWithRelations = Visitor & {
  interests: Interest[];
  preferences: Preference[];
  sessions?: Session[];
  submissions?: FormSubmission[];
};

export class PabblyService {
  private static PABBLY_WEBHOOK_URL = process.env.PABBLY_WEBHOOK_URL || 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMTA0MzE1MjZjNTUzMjUxM2Ii_pc';
  
  /**
   * Create visitor record and send data to Pabbly
   */
  public static async processFormSubmission(formData: any): Promise<{
    success: boolean;
    visitor?: VisitorWithRelations;
    error?: string;
  }> {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        age,
        reasons,
        occupation,
        interests,
        preferences,
        company,
        department,
        isPartial = false,
        lastFieldSeen,
        timeSpent,
        
        // Session data
        ipAddress,
        userAgent,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign
      } = formData;
      
      // Create or update visitor
      const visitor = await this.createOrUpdateVisitor({
        firstName,
        lastName,
        email,
        phone,
        age: age ? parseInt(age) : undefined,
        reasons,
        occupation: occupation as Occupation,
        company,
        department,
        interests: interests as InterestType[],
        preferences: preferences as PreferenceType[]
      });
      
      let session = await prisma.session.findFirst({
        where: {
          visitorId: visitor.id,
          createdAt: {
            gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          }
        }
      });
      
      if (session) {
        session = await prisma.session.update({
          where: { id: session.id },
          data: {
            referrer: referrer || session.referrer,
            utmSource: utmSource || session.utmSource,
            utmMedium: utmMedium || session.utmMedium,
            utmCampaign: utmCampaign || session.utmCampaign,
            updatedAt: new Date()
          }
        });
      } else {
        session = await prisma.session.create({
          data: {
            visitorId: visitor.id,
            ipAddress,
            userAgent,
            referrer,
            utmSource,
            utmMedium,
            utmCampaign,
            browser: this.getBrowserFromUserAgent(userAgent),
            deviceType: this.getDeviceTypeFromUserAgent(userAgent),
            os: this.getOSFromUserAgent(userAgent)
          }
        });
      }
    
      const submission = await prisma.formSubmission.create({
        data: {
          visitorId: visitor.id,
          sessionId: session.id,
          status: isPartial ? SubmissionStatus.PARTIAL : SubmissionStatus.COMPLETED,
          personalInfo: !!firstName && !!lastName,
          contactInfo: !!email || !!phone,
          reasonsInfo: !!reasons,
          interestsInfo: !!interests && (Array.isArray(interests) ? interests.length > 0 : !!interests),
          preferencesInfo: !!preferences && (Array.isArray(preferences) ? preferences.length > 0 : !!preferences),
          lastFieldSeen: isPartial ? lastFieldSeen : undefined,
          timeSpent,
          submitTime: isPartial ? undefined : new Date()
        }
      });
    
      const pabblyResponse = await this.sendToPabbly(
        visitor,
        session,
        submission,
        isPartial
      );
    
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          sentToPabbly: true,
          pabblyResponse: JSON.stringify(pabblyResponse),
          pabblySentAt: new Date()
        }
      });
      
     
      const completeVisitor = await prisma.visitor.findUnique({
        where: { id: visitor.id },
        include: {
          interests: true,
          preferences: true,
          sessions: true,
          submissions: true
        }
      }) as VisitorWithRelations;
      

      if (!isPartial && !submission.interestsInfo && !submission.preferencesInfo && email) {
       
        this.sendMissingPreferencesEmail(
          email, 
          firstName, 
          !submission.interestsInfo, 
          !submission.preferencesInfo
        );
      }
      
      return {
        success: true,
        visitor: completeVisitor
      };
    } catch (error) {
      console.error('Error processing form submission:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Create or update a visitor
   */
  private static async createOrUpdateVisitor(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    age?: number;
    reasons?: string;
    occupation?: Occupation;
    company?: string;
    department?: string;
    interests?: InterestType[];
    preferences?: PreferenceType[];
  }): Promise<Visitor> {
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      reasons,
      occupation,
      company,
      department,
      interests,
      preferences
    } = data;
    
    
    let visitor: Visitor | null = null;
    
    if (email) {
      visitor = await prisma.visitor.findFirst({
        where: { email }
      });
    }
    
    if (visitor) {

      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          firstName: firstName || visitor.firstName,
          lastName: lastName || visitor.lastName,
          phone: phone || visitor.phone,
          age: age || visitor.age,
          reasons: reasons || visitor.reasons,
          occupation: occupation || visitor.occupation,
          company: company || visitor.company,
          department: department || visitor.department
        }
      });
    } else {
      visitor = await prisma.visitor.create({
        data: {
          firstName:firstName!,
          lastName:lastName!,
          email,
          phone,
          age,
          reasons,
          occupation,
          company,
          department
        }
      });
    }
  
    if (interests && interests.length > 0) {
      try {
        await prisma.interest.deleteMany({
          where: { visitorId: visitor.id }
        });
    
        for (const interest of interests) {
          if (Object.values(InterestType).includes(interest)) {
            await prisma.interest.create({
              data: {
                visitorId: visitor.id,
                type: interest,
                updatedAt: new Date()
              }
            });
          } else {
            console.warn(`Skipping invalid interest type: ${interest}`);
          }
        }
      } catch (error) {
        console.error('Error processing interests:', error);
        
      }
    }
    
 
    if (preferences && preferences.length > 0) {
      try {
      
        await prisma.preference.deleteMany({
          where: { visitorId: visitor.id }
        });
        
        
        for (const preference of preferences) {
         
          if (Object.values(PreferenceType).includes(preference)) {
            await prisma.preference.create({
              data: {
                visitorId: visitor.id,
                type: preference,
                updatedAt: new Date()
              }
            });
          } else {
            console.warn(`Skipping invalid preference type: ${preference}`);
          }
        }
      } catch (error) {
        console.error('Error processing preferences:', error);
      
      }
    }
    
    return visitor;
  }
  
  /**
   * Send data to Pabbly
   */
  private static async sendToPabbly(
    visitor: Visitor,
    session: Session,
    submission: FormSubmission,
    isPartial: boolean
  ): Promise<any> {
    
    const interests = await prisma.interest.findMany({
      where: { visitorId: visitor.id }
    });
    
    const preferences = await prisma.preference.findMany({
      where: { visitorId: visitor.id }
    });
    
   
    const interestTypes = interests.map(i => i.type);
    const preferenceTypes = preferences.map(p => p.type);
    
    
    const payload = isPartial
      ? this.createPartialSubmissionPayload(visitor, session, submission, interestTypes, preferenceTypes)
      : this.createCompleteSubmissionPayload(visitor, session, submission, interestTypes, preferenceTypes);
    
    
    console.log(`Sending ${isPartial ? 'partial' : 'complete'} submission to Pabbly:`, JSON.stringify(payload, null, 2));
    
    try {
      const response = await axios.post(this.PABBLY_WEBHOOK_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending data to Pabbly:', error);
      
      
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
      }
      
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send email for missing preferences or interests
   */
  private static async sendMissingPreferencesEmail(
    email: string,
    firstName: string,
    missingInterests: boolean,
    missingPreferences: boolean
  ): Promise<void> {
    try {
     
      const result = await EmailService.sendPreferencesReminderEmail(
        email,
        firstName,
        missingInterests,
        missingPreferences
      );

      if (result) {
        console.log(`Reminder email sent successfully to ${email}`);
      } else {
        console.warn(`Failed to send reminder email to ${email}`);
      }
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  }
  
  /**
   * Create payload for complete submission
   */
  private static createCompleteSubmissionPayload(
    visitor: Visitor,
    session: Session,
    submission: FormSubmission,
    interests: InterestType[],
    preferences: PreferenceType[]
  ): any {
    return {
    
      event_type: "form_submission",
      submission_status: "complete",
      timestamp: new Date().toISOString(),
      
    
      company: visitor.company || "EdPulse-Education",
      department: visitor.department || "MARKETING",
      
   
      visitor: {
        id: visitor.id,
        first_name: visitor.firstName,
        last_name: visitor.lastName,
        email: visitor.email,
        phone: visitor.phone,
        age: visitor.age,
        occupation: visitor.occupation,
        reasons: visitor.reasons
      },
      
    
      interests,
      preferences,
      
     
      form_analytics: {
        submission_id: submission.id,
        start_time: submission.startTime.toISOString(),
        submit_time: submission.submitTime?.toISOString(),
        time_spent_seconds: submission.timeSpent
      },
      
     
      session: {
        id: session.id,
        referrer: session.referrer,
        
    
        browser: session.browser,
        device_type: session.deviceType,
        os: session.os,
        
      
        utm_source: session.utmSource,
        utm_medium: session.utmMedium,
        utm_campaign: session.utmCampaign
      }
    };
  }
  
  /**
   * Create payload for partial submission
   */
  private static createPartialSubmissionPayload(
    visitor: Visitor,
    session: Session,
    submission: FormSubmission,
    interests: InterestType[],
    preferences: PreferenceType[]
  ): any {
    return {
     
      event_type: "form_submission",
      submission_status: "partial",
      timestamp: new Date().toISOString(),
      
   
      company: visitor.company || "EdPulse-Education",
      department: visitor.department || "MARKETING",
      
    
      visitor: {
        id: visitor.id,
        first_name: visitor.firstName,
        last_name: visitor.lastName,
        email: visitor.email,
        phone: visitor.phone,
        age: visitor.age,
        occupation: visitor.occupation,
        reasons: visitor.reasons
      },
      
      ...(submission.interestsInfo ? { interests } : {}),
      ...(submission.preferencesInfo ? { preferences } : {}),
      
    
      form_analytics: {
        submission_id: submission.id,
        start_time: submission.startTime.toISOString(),
        dropout_time: submission.updatedAt.toISOString(),
        time_spent_seconds: submission.timeSpent,
        last_field_seen: submission.lastFieldSeen,
        completed_sections: {
          personal_info: submission.personalInfo,
          contact_info: submission.contactInfo,
          reasons_info: submission.reasonsInfo,
          interests_info: submission.interestsInfo,
          preferences_info: submission.preferencesInfo
        }
      },
      
     
      session: {
        id: session.id,
        referrer: session.referrer,
        
      
        browser: session.browser,
        device_type: session.deviceType,
        os: session.os,
        
        utm_source: session.utmSource,
        utm_medium: session.utmMedium,
        utm_campaign: session.utmCampaign
      }
    };
  }
  
  /**
   * Helper method to get browser from user agent
   */
  private static getBrowserFromUserAgent(userAgent?: string): string | null {
    if (!userAgent) return null;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    
    return 'Unknown';
  }
  
  /**
   * Helper method to get device type from user agent
   */
  private static getDeviceTypeFromUserAgent(userAgent?: string): string | null {
    if (!userAgent) return null;
    
    if (userAgent.includes('Mobile')) return 'mobile';
    if (userAgent.includes('Tablet')) return 'tablet';
    return 'desktop';
  }
  
  /**
   * Helper method to get OS from user agent
   */
  private static getOSFromUserAgent(userAgent?: string): string | null {
    if (!userAgent) return null;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    
    return 'Unknown';
  }
}