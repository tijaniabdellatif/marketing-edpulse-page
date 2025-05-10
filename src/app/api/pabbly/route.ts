// app/api/pabbly/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PabblyService } from '@/server/pabbly/pabbly.service';
import { parseInterests, parsePreferences } from '@/lib/parser/parser';
import { InterestType, PreferenceType } from '@prisma/client';

/**
 * Parses user agent for browser, device type, and OS information
 */
function parseUserAgent(userAgent?: string | null) {
  if (!userAgent) return { browser: null, deviceType: null, os: null };
  
  // Parse browser
  let browser = null;
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) browser = 'Internet Explorer';
  
  // Parse device type
  const deviceType = userAgent.includes('Mobile') ? 'mobile' : 
                     userAgent.includes('Tablet') ? 'tablet' : 'desktop';
  
  // Parse OS
  let os = null;
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  
  return { browser, deviceType, os };
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract all form data
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      age,
      reasons, 
      interests,
      preferences,
      occupation,
      company,
      department,
      timeSpent,
      lastFieldSeen,
      userAgent: clientUserAgent,
      referrer: clientReferrer
    } = body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Parse tracking information
    const userAgent = clientUserAgent || request.headers.get('user-agent');
    const referrer = clientReferrer || request.headers.get('referer');
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      '127.0.0.1';
    const { browser, deviceType, os } = parseUserAgent(userAgent);
    
    // Parse UTM parameters from URL
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source') || body.utmSource || null;
    const utmMedium = url.searchParams.get('utm_medium') || body.utmMedium || null;
    const utmCampaign = url.searchParams.get('utm_campaign') || body.utmCampaign || null;
    
    // Parse interests and preferences if provided
    // Make sure to handle the case where interests might be an array or object instead of a string
    let parsedInterests:any[] = [];
    let parsedPreferences:any[] = [];
    
    try {
      if (typeof interests === 'string') {
        parsedInterests = parseInterests(interests);
      } else if (Array.isArray(interests)) {
        // Filter to include only valid InterestType values
        parsedInterests = interests.filter(interest => 
          Object.values(InterestType).includes(interest as InterestType)
        ) as InterestType[];
      }
      
      if (typeof preferences === 'string') {
        parsedPreferences = parsePreferences(preferences);
      } else if (Array.isArray(preferences)) {
        // Filter to include only valid PreferenceType values
        parsedPreferences = preferences.filter(preference => 
          Object.values(PreferenceType).includes(preference as PreferenceType)
        ) as PreferenceType[];
      }
    } catch (err) {
      console.warn('Error parsing interests or preferences:', err);
      // Default to empty arrays if parsing fails
      parsedInterests = [];
      parsedPreferences = [];
    }
    
    // Use the PabblyService to process the form submission
    const result = await PabblyService.processFormSubmission({
      // Visitor info
      firstName,
      lastName,
      email,
      phone,
      age: age ? parseInt(age) : undefined,
      reasons,
      occupation,
      company,
      department,
      
      // Form data
      interests: parsedInterests,
      preferences: parsedPreferences,
      isPartial: false,
      timeSpent: timeSpent || 0,
      
      // Session data
      ipAddress,
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign
    });
    
    if (!result.success) {
      console.error('Error processing form submission:', result.error);
      
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to process form submission'
        },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Data sent to Pabbly successfully',
      visitorId: result.visitor?.id
    });
  } catch (error) {
    console.error('Error sending data to Pabbly:', error);
    
    // Format the error message
    let errorMessage = 'Failed to send data to Pabbly';
    let errorStatus = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // If the error message contains 'CORS' or 'Network Error', provide a more helpful message
      if (errorMessage.includes('CORS') || errorMessage.includes('Network Error')) {
        errorMessage = 'Cannot reach Pabbly service. This might be due to CORS restrictions or network issues.';
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: errorStatus }
    );
  }
}