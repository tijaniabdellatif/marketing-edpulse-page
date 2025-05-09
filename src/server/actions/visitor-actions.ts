'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  visitorFormSchema, 
  visitorCreateSchema,
  OcupationEnum,
  type VisitorFormValues,
  type VisitorTrackingData,
  type VisitorCreateData,
  visitorTrackingSchema
} from '@/lib/validator/visitor-schema';
import { getClientIp } from '@/lib/utils';

// Verify environment variables are set
const checkEnvVariables = () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return false;
  }
  return true;
};

export async function createVisitor(prevState: any, formData: FormData) {
  // Log start of function
  console.log('Starting createVisitor server action');
  
  // Check environment variables first
  if (!checkEnvVariables()) {
    return {
      success: false,
      message: 'Server configuration error. Please contact support.'
    };
  }
  
  try {
    // Extract form data
    const values = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      age: parseInt(formData.get('age') as string, 10),
      occupation: formData.get('occupation') as string,
      bio: formData.get('bio') as string || undefined,
    };
    
    // Log extracted data (without sensitive info)
    console.log('Form data extracted:', { 
      firstName: values.firstName,
      lastName: values.lastName,
      hasEmail: !!values.email,
      age: values.age,
      occupation: values.occupation,
      hasBio: !!values.bio
    });
    
    // Extract tracking data
    const trackingData: VisitorTrackingData = {
      ipAddress: formData.get('ipAddress') as string || undefined,
      userAgent: formData.get('userAgent') as string || undefined,
      fingerprint: formData.get('fingerprint') as string || undefined,
    };

    // Don't include Date objects in the data to validate
    // We'll handle these separately after validation
    const dataToValidate = {
      ...values,
      ...trackingData,
      currentLevel: 'A1' as const, // Default level
    };

    // Log validation attempt
    console.log('Attempting to validate data...');
    
    // Validate with your schema
    const validatedData = visitorFormSchema.merge(visitorTrackingSchema).parse(dataToValidate);
    console.log('Data validation successful');
    
    // Check if visitor exists with this email
    console.log('Checking if visitor exists with email:', values.email);
    const existingVisitor = await prisma.visitor.findFirst({
      where: { email: validatedData.email }
    });
    
    let visitor;
    
    // Update existing visitor or create new one
    if (existingVisitor) {
      console.log('Existing visitor found, updating record:', existingVisitor.id);
      visitor = await prisma.visitor.update({
        where: { id: existingVisitor.id },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          age: validatedData.age,
          occupation: validatedData.occupation,
          // Only update bio if provided
          ...(validatedData.bio && { bio: validatedData.bio }),
        }
      });
      console.log('Visitor updated successfully');
    } else {
      console.log('No existing visitor found, creating new record');
      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          age: validatedData.age,
          occupation: validatedData.occupation,
          bio: validatedData.bio,
          currentLevel: 'A1',
        }
      });
      console.log('Visitor created successfully, ID:', visitor.id);
      
      // Create initial session
      console.log('Creating initial session for visitor');
      const now = new Date(); // Only create the Date object once we need it
      await prisma.session.create({
        data: {
          visitorId: visitor.id,
          ipAddress: validatedData.ipAddress || null,
          userAgent: validatedData.userAgent || null,
          startTime: now // Use Date object directly in the Prisma call
        }
      });
      console.log('Session created successfully');
    }

    revalidatePath('/');
    
    return {
      success: true,
      message: existingVisitor ? 'Information updated' : 'Profile created',
      visitorId: visitor.id
    };
    
  } catch (error: any) {
    // Enhanced error logging with detailed information
    console.error('Error in createVisitor:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      meta: error.meta,
    });
    
    // Handle Zod validation errors
    if (error.errors) {
      const fieldErrors = error.errors.reduce((acc: any, err: any) => {
        const field = err.path[0];
        if (!acc[field]) acc[field] = [];
        acc[field].push(err.message);
        return acc;
      }, {});
      
      return {
        success: false,
        message: 'Please correct the errors in the form.',
        errors: fieldErrors
      };
    }
    
    // Handle unique constraint errors (email already exists)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return {
        success: false,
        message: 'This email is already registered.',
        errors: { email: ['This email is already registered.'] }
      };
    }
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return {
        success: false,
        message: 'Unable to connect to the database. Please try again later.',
        errorCode: error.code
      };
    }
    
    // Return more details in development
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong. Please try again.' 
        : `Error: ${error.message}`,
      errorDetails: process.env.NODE_ENV !== 'production' ? error : undefined
    };
  }
}

export async function updateVisitorBio(prevState: any, formData: FormData) {
  console.log('Starting updateVisitorBio server action');
  
  try {
    const visitorId = formData.get('visitorId') as string;
    const bio = formData.get('bio') as string;
    
    console.log('Updating bio for visitor:', visitorId);
    
    if (!visitorId) {
      console.error('No visitor ID provided');
      return {
        success: false,
        message: 'No visitor ID provided. Please complete step 1 first.'
      };
    }
    
    // Validate bio using the schema
    console.log('Validating bio...');
    const bioUpdate = { bio };
    const validation = visitorFormSchema.partial().safeParse(bioUpdate);
    
    if (!validation.success) {
      console.error('Bio validation failed:', validation.error);
      return {
        success: false,
        message: 'Please enter a valid bio.',
        errors: { bio: ['Bio validation failed.'] }
      };
    }
    
    // Update visitor with bio
    console.log('Validation successful, updating visitor');
    const visitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: { bio }
    });
    
    console.log('Bio updated successfully');
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Your bio has been saved.',
      visitorId: visitor.id
    };
    
  } catch (error: any) {
    console.error('Error updating bio:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      meta: error.meta,
    });
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return {
        success: false,
        message: 'Unable to connect to the database. Please try again later.',
        errorCode: error.code
      };
    }
    
    // Handle record not found
    if (error.code === 'P2025') {
      return {
        success: false,
        message: 'Visitor not found. Please try again.',
        errorCode: error.code
      };
    }
    
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong while saving your bio. Please try again.' 
        : `Error: ${error.message}`,
      errorDetails: process.env.NODE_ENV !== 'production' ? error : undefined
    };
  }
}

/**
 * Start a new session for a visitor
 */
export async function startSession(visitorId: string, trackingData: VisitorTrackingData) {
  console.log('Starting new session for visitor:', visitorId);
  
  try {
    if (!visitorId) {
      console.error('No visitor ID provided');
      return {
        success: false,
        message: 'No visitor ID provided.'
      };
    }
    
    // Validate tracking data
    console.log('Validating tracking data');
    const validation = visitorTrackingSchema.safeParse(trackingData);
    if (!validation.success) {
      console.error('Tracking data validation failed:', validation.error);
      return {
        success: false,
        message: 'Invalid tracking data.'
      };
    }
    
    // Create a new session with validated data
    console.log('Validation successful, creating session');
    const now = new Date();
    const session = await prisma.session.create({
      data: {
        visitorId,
        ipAddress: trackingData.ipAddress || null,
        userAgent: trackingData.userAgent || null,
        startTime: now
      }
    });
    
    console.log('Session created successfully:', session.id);
    return {
      success: true,
      sessionId: session.id
    };
  } catch (error: any) {
    console.error('Error starting session:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      meta: error.meta,
    });
    
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Failed to start session' 
        : `Error: ${error.message}`
    };
  }
}

/**
 * End a session and calculate duration
 */
export async function endSession(sessionId: string) {
  console.log('Ending session:', sessionId);
  
  try {
    // Find the session
    console.log('Finding session in database');
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      console.error('Session not found');
      return {
        success: false,
        message: 'Session not found'
      };
    }
    
    // Calculate duration
    console.log('Session found, calculating duration');
    const endTime = new Date();
    const startTime = session.startTime;
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // in seconds
    
    // Update session
    console.log('Updating session with end time and duration');
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration
      }
    });
    
    console.log('Session ended successfully, duration:', duration);
    return {
      success: true,
      duration
    };
  } catch (error: any) {
    console.error('Error ending session:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      meta: error.meta,
    });
    
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Failed to end session' 
        : `Error: ${error.message}`
    };
  }
}

/**
 * Skip the quiz and go directly to dashboard
 */
export async function skipToQuiz(visitorId: string) {
  console.log('Skip to quiz requested for visitor:', visitorId);
  
  try {
    if (!visitorId) {
      console.error('No visitor ID provided');
      return {
        success: false,
        message: 'No visitor ID provided.'
      };
    }
    
    // Record that the visitor skipped
    console.log('Recording skip action in database');
    await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        // Any data to record when skipping
      }
    });
    
    console.log('Skip recorded successfully, redirecting to dashboard');
    // Redirect to dashboard
    redirect('/dashboard');
    
  } catch (error: any) {
    console.error('Error skipping quiz:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      meta: error.meta,
    });
    
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Failed to skip quiz' 
        : `Error: ${error.message}`
    };
  }
}