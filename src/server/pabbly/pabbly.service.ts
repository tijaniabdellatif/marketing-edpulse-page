// lib/services/pabbly.service.ts

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

/**
 * Service for sending data to Pabbly
 */
export class PabblyService {
  private static PABBLY_WEBHOOK_URL = process.env.PABBLY_WEBHOOK_URL || 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMDA0MzI1MjY4NTUzMjUxMzYi_pc';
  
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
      
      // Find existing session or create a new one
      let session = await prisma.session.findFirst({
        where: {
          visitorId: visitor.id,
          createdAt: {
            // Find sessions created in the last 24 hours
            gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          }
        }
      });
      
      if (session) {
        // Update existing session with new data
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
        // Create a new session if none exists
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
      
      // Create form submission
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
      
      // Send to Pabbly
      const pabblyResponse = await this.sendToPabbly(
        visitor,
        session,
        submission,
        isPartial
      );
      
      // Update submission with Pabbly response
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          sentToPabbly: true,
          pabblyResponse: JSON.stringify(pabblyResponse),
          pabblySentAt: new Date()
        }
      });
      
      // Get the complete visitor with all relations
      const completeVisitor = await prisma.visitor.findUnique({
        where: { id: visitor.id },
        include: {
          interests: true,
          preferences: true,
          sessions: true,
          submissions: true
        }
      }) as VisitorWithRelations;
      
      // Check if email is needed for missing preferences or interests
      if (!isPartial && !submission.interestsInfo && !submission.preferencesInfo && email) {
        // Only send email if this is a complete submission, not partial
        // and if both interests and preferences are missing
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
    
    // Try to find visitor by email
    let visitor: Visitor | null = null;
    
    if (email) {
      visitor = await prisma.visitor.findFirst({
        where: { email }
      });
    }
    
    if (visitor) {
      // Update existing visitor
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
      // Create new visitor
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
    
    // Process interests if provided
    if (interests && interests.length > 0) {
      try {
        // Delete existing interests
        await prisma.interest.deleteMany({
          where: { visitorId: visitor.id }
        });
        
        // Create new interests with proper type validation
        for (const interest of interests) {
          // Validate that interest is a valid enum value
          if (Object.values(InterestType).includes(interest)) {
            await prisma.interest.create({
              data: {
                visitorId: visitor.id,
                type: interest,
                updatedAt: new Date() // Explicitly set updatedAt
              }
            });
          } else {
            console.warn(`Skipping invalid interest type: ${interest}`);
          }
        }
      } catch (error) {
        console.error('Error processing interests:', error);
        // Continue execution even if interest processing fails
      }
    }
    
    // Process preferences if provided
    if (preferences && preferences.length > 0) {
      try {
        // Delete existing preferences
        await prisma.preference.deleteMany({
          where: { visitorId: visitor.id }
        });
        
        // Create new preferences with proper type validation
        for (const preference of preferences) {
          // Validate that preference is a valid enum value
          if (Object.values(PreferenceType).includes(preference)) {
            await prisma.preference.create({
              data: {
                visitorId: visitor.id,
                type: preference,
                updatedAt: new Date() // Explicitly set updatedAt
              }
            });
          } else {
            console.warn(`Skipping invalid preference type: ${preference}`);
          }
        }
      } catch (error) {
        console.error('Error processing preferences:', error);
        // Continue execution even if preference processing fails
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
    // Get interests and preferences
    const interests = await prisma.interest.findMany({
      where: { visitorId: visitor.id }
    });
    
    const preferences = await prisma.preference.findMany({
      where: { visitorId: visitor.id }
    });
    
    // Format interests and preferences for Pabbly
    const interestTypes = interests.map(i => i.type);
    const preferenceTypes = preferences.map(p => p.type);
    
    // Create payload based on submission type
    const payload = isPartial
      ? this.createPartialSubmissionPayload(visitor, session, submission, interestTypes, preferenceTypes)
      : this.createCompleteSubmissionPayload(visitor, session, submission, interestTypes, preferenceTypes);
    
    // Send to Pabbly
    console.log(`Sending ${isPartial ? 'partial' : 'complete'} submission to Pabbly:`, JSON.stringify(payload, null, 2));
    
    try {
      const response = await axios.post(this.PABBLY_WEBHOOK_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending data to Pabbly:', error);
      
      // Return error information for debugging
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
      // Send email
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
      // Metadata
      event_type: "form_submission",
      submission_status: "complete",
      timestamp: new Date().toISOString(),
      
      // Company information
      company: visitor.company || "EdPulse-Education",
      department: visitor.department || "MARKETING",
      
      // Visitor information
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
      
      // Interest and preference selections
      interests,
      preferences,
      
      // Form analytics
      form_analytics: {
        submission_id: submission.id,
        start_time: submission.startTime.toISOString(),
        submit_time: submission.submitTime?.toISOString(),
        time_spent_seconds: submission.timeSpent
      },
      
      // Session information
      session: {
        id: session.id,
        referrer: session.referrer,
        
        // Device information
        browser: session.browser,
        device_type: session.deviceType,
        os: session.os,
        
        // UTM parameters
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
      // Metadata
      event_type: "form_submission",
      submission_status: "partial",
      timestamp: new Date().toISOString(),
      
      // Company information
      company: visitor.company || "EdPulse-Education",
      department: visitor.department || "MARKETING",
      
      // Visitor information
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
      
      // Interest and preference selections (if completed)
      ...(submission.interestsInfo ? { interests } : {}),
      ...(submission.preferencesInfo ? { preferences } : {}),
      
      // Form analytics
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
      
      // Session information
      session: {
        id: session.id,
        referrer: session.referrer,
        
        // Device information
        browser: session.browser,
        device_type: session.deviceType,
        os: session.os,
        
        // UTM parameters
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