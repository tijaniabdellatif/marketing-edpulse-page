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


export async function createVisitor(prevState: any, formData: FormData) {
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

    // Validate with your schema
    const validatedData = visitorFormSchema.merge(visitorTrackingSchema).parse(dataToValidate);
    
    // Check if visitor exists with this email
    const existingVisitor = await prisma.visitor.findFirst({
      where: { email: validatedData.email }
    });
    
    let visitor;
    
    // Update existing visitor or create new one
    if (existingVisitor) {
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
    } else {
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
      
      // Create initial session
      const now = new Date(); // Only create the Date object once we need it
      await prisma.session.create({
        data: {
          visitorId: visitor.id,
          ipAddress: validatedData.ipAddress || null,
          userAgent: validatedData.userAgent || null,
          startTime: now // Use Date object directly in the Prisma call
        }
      });
    }

    revalidatePath('/');
    
    return {
      success: true,
      message: existingVisitor ? 'Information updated' : 'Profile created',
      visitorId: visitor.id
    };
    
  } catch (error:any) {
    console.error('Error in createVisitor:', error);
    
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
    
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    };
  }
}

export async function updateVisitorBio(prevState: any, formData: FormData) {
  try {
    const visitorId = formData.get('visitorId') as string;
    const bio = formData.get('bio') as string;
    
    if (!visitorId) {
      return {
        success: false,
        message: 'No visitor ID provided. Please complete step 1 first.'
      };
    }
    
    // Validate bio using the schema
    const bioUpdate = { bio };
    const validation = visitorFormSchema.partial().safeParse(bioUpdate);
    
    if (!validation.success) {
      return {
        success: false,
        message: 'Please enter a valid bio.',
        errors: { bio: ['Bio validation failed.'] }
      };
    }
    
    // Update visitor with bio
    const visitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: { bio }
    });
    
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Your bio has been saved.',
      visitorId: visitor.id
    };
    
  } catch (error) {
    console.error('Error updating bio:', error);
    
    return {
      success: false,
      message: 'Something went wrong while saving your bio. Please try again.'
    };
  }
}

/**
 * Start a new session for a visitor
 */
export async function startSession(visitorId: string, trackingData: VisitorTrackingData) {
  try {
    if (!visitorId) {
      return {
        success: false,
        message: 'No visitor ID provided.'
      };
    }
    
    // Validate tracking data
    const validation = visitorTrackingSchema.safeParse(trackingData);
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid tracking data.'
      };
    }
    
    // Create a new session with validated data
    const now = new Date();
    const session = await prisma.session.create({
      data: {
        visitorId,
        ipAddress: trackingData.ipAddress || null,
        userAgent: trackingData.userAgent || null,
        startTime: now
      }
    });
    
    return {
      success: true,
      sessionId: session.id
    };
  } catch (error) {
    console.error('Error starting session:', error);
    return {
      success: false,
      message: 'Failed to start session'
    };
  }
}

/**
 * End a session and calculate duration
 */
export async function endSession(sessionId: string) {
  try {
    // Find the session
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      return {
        success: false,
        message: 'Session not found'
      };
    }
    
    // Calculate duration
    const endTime = new Date();
    const startTime = session.startTime;
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // in seconds
    
    // Update session
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration
      }
    });
    
    return {
      success: true,
      duration
    };
  } catch (error) {
    console.error('Error ending session:', error);
    return {
      success: false,
      message: 'Failed to end session'
    };
  }
}

/**
 * Skip the quiz and go directly to dashboard
 */
export async function skipToQuiz(visitorId: string) {
  try {
    if (!visitorId) {
      return {
        success: false,
        message: 'No visitor ID provided.'
      };
    }
    
    // Record that the visitor skipped
    await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        // Any data to record when skipping
      }
    });
    
    // Redirect to dashboard
    redirect('/dashboard');
    
  } catch (error) {
    console.error('Error skipping quiz:', error);
    return {
      success: false,
      message: 'Failed to skip to quiz'
    };
  }
}