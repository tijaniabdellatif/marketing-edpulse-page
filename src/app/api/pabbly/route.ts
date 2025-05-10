// app/api/pabbly/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Pabbly webhook URL - Replace with your actual webhook URL
const PABBLY_WEBHOOK_URL = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMDA0MzQ1MjY1NTUzMDUxMzEi_pc';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract all form data
    const { firstName, lastName, email, phone, reasons, interests } = body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Create payload with all fields
    const payload = {
      // Required fields
      firstName,
      lastName,
      
      // Optional fields (only include if they exist)
      ...(email && { email }),
      ...(phone && { phone }),
      ...(reasons && { reasons }),
      ...(interests && { interests }),
      
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'website_modal',
      
      // You can add additional metadata as needed
      pageUrl: request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    };
    
    console.log('Sending data to Pabbly:', payload);
    
    // Send data to Pabbly
    const response = await axios.post(PABBLY_WEBHOOK_URL, payload);
    
    console.log('Pabbly response:', response.data);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Data sent to Pabbly successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error sending data to Pabbly:', error);
    
    // Format the error message
    let errorMessage = 'Failed to send data to Pabbly';
    let errorStatus = 500;
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
      // If the error is related to CORS, provide a more helpful message
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        errorMessage = 'Cannot reach Pabbly service. This might be due to CORS restrictions or network issues.';
      }
      errorStatus = error.response?.status || 500;
      
      // Log detailed error information
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    } else if (error instanceof Error) {
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