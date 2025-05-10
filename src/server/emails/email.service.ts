

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
  path:'.env'
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static getTransporter() {
    
    console.log('Email service initializing with config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER ? '✓ Present' : '✗ Missing',
        pass: process.env.EMAIL_PASSWORD ? '✓ Present' : '✗ Missing'
      }
    });
    
  
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || '465', 465),
      secure:  true,
      auth: {
        user: process.env.EMAIL_USER || 'tijani.idrissi.abdellatif@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'dtmo bqmd ioro plzu',
      },
      debug:true
      
    });
  }

  private static defaultFromEmail = process.env.EMAIL_FROM || 'noreply@edpulse-education.com';

  /**
   * Send a general email
   */
  public static async sendEmail(options: EmailOptions): Promise<boolean> {
    const transporter = this.getTransporter();
    
    try {
      
      await transporter.verify();
      console.log(`SMTP connection verified successfully to ${process.env.EMAIL_HOST}`);
      
      const { to, subject, html, from } = options;

      const mailOptions = {
        from: from || this.defaultFromEmail,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to} (${info.messageId})`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error instanceof Error) {
        console.error(`Error name: ${error.name}, message: ${error.message}`);
      
        console.error('Environment context:', {
          NODE_ENV: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL,
          email_host: process.env.EMAIL_HOST,
          email_port: process.env.EMAIL_PORT
        });
      }
      return false;
    }
  }

  public static async sendPreferencesReminderEmail(
    email: string,
    firstName: string,
    missingInterests: boolean,
    missingPreferences: boolean
  ): Promise<boolean> {
   
    try {
      if (!email) {
        console.warn('Cannot send reminder email: no email address provided');
        return false;
      }

      let whatsMissing = '';
      if (missingInterests && missingPreferences) {
        whatsMissing = 'learning topics and preferences';
      } else if (missingInterests) {
        whatsMissing = 'learning topics';
      } else if (missingPreferences) {
        whatsMissing = 'learning preferences';
      } else {
        console.warn('Cannot send reminder email: nothing is missing');
        return false;
      }

      const subject = `Complete Your Learning Profile for a Better Experience`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: #0284c7; margin-top: 0; font-size: 24px;">Hello ${firstName}!</h1>
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">Thank you for joining EdPulse Education!</p>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">We noticed you didn't select any ${whatsMissing} during registration. To provide you with the best personalized learning experience, we recommend updating your profile with this information.</p>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #0284c7;">
              <p style="color: #334155; font-size: 16px; margin-top: 0;">Personalizing your learning path helps us:</p>
              <ul style="color: #334155; font-size: 16px; line-height: 1.5;">
                <li>Recommend relevant courses and materials</li>
                <li>Match you with suitable learning groups</li>
                <li>Adjust teaching methods to your preferred learning style</li>
              </ul>
            </div>
            
            
            <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-top: 25px;">If you have any questions, feel free to reply to this email.</p>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">Best regards,<br>The EdPulse Education Team</p>
          </div>
          
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            <p>© ${new Date().getFullYear()} EdPulse Education. All rights reserved.</p>
            <p>If you don't want to receive these emails, you can <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #64748b;">unsubscribe</a>.</p>
          </div>
        </div>
      `;

      return await this.sendEmail({ to: email, subject, html });
    } catch (error) {
      console.error('Error sending preferences reminder email:', error);
      return false;
    }
  }
}