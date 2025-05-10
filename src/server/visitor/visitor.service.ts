import { axiosService } from '@/server/services/axios-service';

// Visitor data interface
export interface IVisitor {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  message?: string;
}

export class VisitorService {
  /**
   * Submit visitor data to webhook
   */
  public static async submitVisitor(visitorData: IVisitor): Promise<any> {
    try {
      
      const response = await axiosService.sendToWebhook('pabbly', {
        event: 'VISITOR_SUBMISSION',
        data: visitorData,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting visitor data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
 
}