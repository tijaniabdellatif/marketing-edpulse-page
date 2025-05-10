import { VisitorService,IVisitor } from "@/server/visitor/visitor.service";
import { revalidatePath } from 'next/cache';

export async function submitUserForm(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string || undefined;
    const phone = formData.get('phone') as string || undefined;
    const message = formData.get('message') as string || undefined;

    if (!firstName || !lastName) {
      return { 
        success: false, 
        error: 'First name and last name are required' 
      };
    }

    // Create user data object
    const userData: IVisitor = {
      firstName,
      lastName,
      email,
      phone,
      message
    };

    // Submit to webhook via service
    const result = await VisitorService.submitVisitor(userData);
    
    // Revalidate the form page
    revalidatePath('/');
    
    return result;
  } catch (error) {
    console.error('Error in submitUserForm:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
