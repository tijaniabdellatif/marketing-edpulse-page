'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  visitorFormSchema,
  OcupationEnum,
  type VisitorFormValues 
} from '@/lib/validator/visitor-schema';
import { createVisitor } from '@/server/actions/visitor-actions';
import { saveVisitorId } from '@/lib/utils';

interface PersonalInfoFormProps {
  onComplete: (visitorId: string) => void;
  onSkip: () => void;
}

export function PersonalInfoForm({ onComplete, onSkip }: PersonalInfoFormProps) {
  // Create form with React Hook Form and Zod validation
  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: undefined,
      occupation: 'STUDENT',
      bio: undefined
    },
  });
  
  // State for form submission and server response
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);
  
  // Handle form submission
  async function onSubmit(data: VisitorFormValues) {
    setIsSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Add form fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('age', data.age?.toString() || '');
      formData.append('occupation', data.occupation);
      
      // Add tracking data
      formData.append('userAgent', navigator.userAgent);
      
      // Create a simple fingerprint
      const fingerprint = `${navigator.userAgent}_${window.screen.width}_${window.screen.height}_${new Date().getTimezoneOffset()}`;
      formData.append('fingerprint', fingerprint);
      
      // Submit the form using the server action directly
      const response = await createVisitor(null, formData);
      
      // Handle response
      if (response.success && response.visitorId) {
        // Save visitor ID
        saveVisitorId(response.visitorId);
        
        // Complete this step
        onComplete(response.visitorId);
      } else {
        // Handle errors
        if (response.errors) {
          setFieldErrors(response.errors);
          
          // Set field errors in the form
          Object.entries(response.errors).forEach(([field, messages]) => {
            form.setError(field as any, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : messages as string
            });
          });
        }
        
        if (response.message) {
          setServerError(response.message);
        }
        
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setServerError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      className="bg-white/10 border-teal-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Last Name Field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      className="bg-white/10 border-teal-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-white/10 border-teal-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Age Field */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      className="bg-white/10 border-teal-primary/20"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === '' 
                          ? undefined 
                          : parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Occupation Field */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-teal-primary/20">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="FREELANCER">Freelancer</SelectItem>
                      <SelectItem value="FREE_OF_FUNCTION">Free of Function</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Server Error Message */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
            >
              {serverError}
            </motion.div>
          )}
          
          {/* Form Actions */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onSkip}
              className="text-light hover:text-white hover:bg-blue-primary/20"
            >
              Skip this step
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-primary hover:bg-teal-dark text-white"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Next Step"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}