'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { updateVisitorBio } from '@/server/actions/visitor-actions';
import { bioSchema, BioFormValues } from '@/lib/validator/bio-schema';
import { BioFormProps } from '@/types';


export function BioForm({ visitorId, onComplete, onSkip }: BioFormProps) {

    const form = useForm<BioFormValues>({
        resolver: zodResolver(bioSchema),
        defaultValues: {
            bio: "",
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function onSubmit(data: BioFormValues) {
        setIsSubmitting(true);
        setServerError(null);
        
        try {
          // Create a FormData object
          const formData = new FormData();
          
          // Add form fields
          formData.append('visitorId', visitorId);
          formData.append('bio', data.bio);
          
          // Submit the form using the server action directly
          const response = await updateVisitorBio(null, formData);
          
          // Handle response
          if (response.success) {
            // Complete this step
            onComplete();
          } else {
            // Handle errors
            if (response.errors && response.errors.bio) {
              form.setError('bio', {
                type: 'server',
                message: Array.isArray(response.errors.bio) 
                  ? response.errors.bio[0] 
                  : response.errors.bio as string
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
              {/* Bio Field */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you hope to achieve with language learning?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I want to learn this language because..."
                        className="min-h-32 bg-white/10 border-teal-primary/20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us about your goals, interests, and what motivates you to learn a language.
                      This helps us tailor the learning experience to your needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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