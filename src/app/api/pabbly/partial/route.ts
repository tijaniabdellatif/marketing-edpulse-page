// app/api/pabbly/partial/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PabblyService } from '@/server/pabbly/pabbly.service';
import { SubmissionStatus, InterestType, PreferenceType } from '@prisma/client';
import { parseInterests, parsePreferences } from '@/lib/parser/parser';

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
    // Get the request body as raw bytes first
    const buffer = await request.arrayBuffer();
    const data = JSON.parse(new TextDecoder().decode(buffer));
    
    // Extract form data
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
      timeSpent,
      lastFieldSeen,
      userAgent,
      referrer
    } = data;
    
    // Validate required fields
    if (!firstName) {
      return NextResponse.json(
        { success: false, message: 'First name is required' },
        { status: 400 }
      );
    }
    
    // Parse tracking information
    const realUserAgent = userAgent || request.headers.get('user-agent');
    const realReferrer = referrer || request.headers.get('referer');
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      '127.0.0.1';
    const { browser, deviceType, os } = parseUserAgent(realUserAgent);
    
    // Parse UTM parameters from URL
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source') || data.utmSource || null;
    const utmMedium = url.searchParams.get('utm_medium') || data.utmMedium || null;
    const utmCampaign = url.searchParams.get('utm_campaign') || data.utmCampaign || null;
    
    // Parse interests and preferences if present
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
      isPartial: true,
      lastFieldSeen,
      timeSpent,
      
      // Session data
      ipAddress,
      userAgent: realUserAgent,
      referrer: realReferrer,
      utmSource,
      utmMedium,
      utmCampaign
    });
    
    if (!result.success) {
      console.error('Error processing partial form submission:', result.error);
      
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to process form submission'
        },
        { status: 500 }
      );
    }
    
    // For beacon API, return successful response
    return NextResponse.json({
      success: true,
      message: 'Partial form data saved successfully',
      visitorId: result.visitor?.id
    });
  } catch (error) {
    console.error('Error processing partial form submission:', error);
    
    // Format the error message
    let errorMessage = 'Failed to process partial form submission';
    let errorStatus = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
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