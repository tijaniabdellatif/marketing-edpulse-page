// lib/services/pabbly.service.ts

import axios from 'axios';
import prisma from '@/lib/prisma';
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
  session?: Session;
  submission?: FormSubmission;
};

/**
 * Service for sending data to Pabbly
 */
export class PabblyService {
  private static PABBLY_WEBHOOK_URL = process.env.PABBLY_WEBHOOK_URL || 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMDA0MzQ1MjY1NTUzMDUxMzEi_pc';
  
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
        interests: interests as InterestType[],
        preferences: preferences as PreferenceType[]
      });
      
      // Create session
      const session = await prisma.session.create({
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
      
      // Create form submission
      const submission = await prisma.formSubmission.create({
        data: {
          visitorId: visitor.id,
          sessionId: session.id,
          status: isPartial ? SubmissionStatus.PARTIAL : SubmissionStatus.COMPLETED,
          personalInfo: !!firstName && !!lastName,
          contactInfo: !!email || !!phone,
          reasonsInfo: !!reasons,
          interestsInfo: !!interests && interests.length > 0,
          preferencesInfo: !!preferences && preferences.length > 0,
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
          session: true,
          submission: true
        }
      }) as VisitorWithRelations;
      
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
          occupation: occupation || visitor.occupation
        }
      });
    } else {
      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          age,
          reasons,
          occupation
        }
      });
    }
    
    // Process interests if provided
    if (interests && interests.length > 0) {
      // Delete existing interests
      await prisma.interest.deleteMany({
        where: { visitorId: visitor.id }
      });
      
      // Create new interests
      for (const interest of interests) {
        await prisma.interest.create({
          data: {
            visitorId: visitor.id,
            type: interest
          }
        });
      }
    }
    
    // Process preferences if provided
    if (preferences && preferences.length > 0) {
      // Delete existing preferences
      await prisma.preference.deleteMany({
        where: { visitorId: visitor.id }
      });
      
      // Create new preferences
      for (const preference of preferences) {
        await prisma.preference.create({
          data: {
            visitorId: visitor.id,
            type: preference
          }
        });
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
    const response = await axios.post(this.PABBLY_WEBHOOK_URL, payload);
    
    return response.data;
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
      company: visitor.company,
      department: visitor.department,
      
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
        start_time: submission.startTime.toISOString(),
        submit_time: submission.submitTime?.toISOString(),
        time_spent_seconds: submission.timeSpent
      },
      
      // Session information
      session: {
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
      company: visitor.company,
      department: visitor.department,
      
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