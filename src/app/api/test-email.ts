// pages/api/test-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { EmailService } from '@/server/emails/email.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add security check - restrict to authorized users
  // This endpoint should not be public in production!
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Log environment details
    console.log('Test email API called with environment:', {
      NODE_ENV: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      emailConfigPresent: !!process.env.EMAIL_HOST && !!process.env.EMAIL_USER
    });
    
    // Get the test destination email from the request or use a default
    const { to = 'tijani.idrissi.abdellatif@gmail.com' } = req.body;
    
    const result = await EmailService.sendEmail({
      to,
      subject: 'Test Email from EdPulse on Vercel',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f9ff; border-radius: 10px;">
          <h1 style="color: #0284c7;">Test Email</h1>
          <p>This is a test email sent from your EdPulse application deployed on Vercel.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
          <p>If you received this email, your email service is working correctly!</p>
        </div>
      `
    });
    
    if (result) {
      return res.status(200).json({ 
        success: true, 
        message: 'Test email sent successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in test-email API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error sending test email', 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
}