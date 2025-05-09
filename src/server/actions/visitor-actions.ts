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

