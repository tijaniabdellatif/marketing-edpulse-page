'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Rocket, Lock, Mail, Phone, MessageSquare, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { visitorFormSchema, type VisitorFormValues } from '@/lib/validator/webhook-schema';

// shadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";

interface MagnetFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function MagnetForm({ onSuccess, onError }: MagnetFormProps) {
  // Status states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize react-hook-form with zod validation
  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      reasons: "",
      interests: ""
    },
  });

  // Handle form submission
  const onSubmit = async (data: VisitorFormValues) => {
    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('Submitting form data:', data);

      // Send to our API route
      const response = await axios.post('/api/pabbly', data);

      console.log('Form submission response:', response.data);

      // Set success state
      setSuccess(true);

      // Clear form
      form.reset();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting form:', err);

      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Call onError callback if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  // Benefits list
  const benefits = [
    {
      icon: <Sparkles className="h-4 w-4 text-blue-500" />,
      text: "Access premium educational content"
    },
    {
      icon: <Rocket className="h-4 w-4 text-purple-500" />,
      text: "Accelerate your learning journey"
    },
    {
      icon: <Lock className="h-4 w-4 text-amber-500" />,
      text: "Secure and personalized experience"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full overflow-visible"
    >
      {/* Form Header */}
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-lg font-bold text-center bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          Join Our Community
        </h3>
      </motion.div>

      {/* Benefits Section */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-col space-y-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-start space-x-2 rounded-md p-1.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gray-50 shadow-sm flex items-center justify-center">
                {benefit.icon}
              </div>
              <span className="text-sm text-gray-600">{benefit.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Form with react-hook-form and shadcn UI */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-1">
          {/* First name and last name row */}
          <div className="grid grid-cols-2 gap-3">
            {/* First Name Field */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Last Name Field */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>Email</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500 pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>Phone</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+1 (123) 456-7890"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500 pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Include country code for international numbers
                  </FormDescription>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Reasons Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="reasons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>Why are you interested in our platform?</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Textarea
                        placeholder="Tell us why you're interested..."
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500 min-h-[80px] pl-9 pt-8 max-h-[150px] overflow-y-auto"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Interests Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>What topics are you interested in?</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BookOpen className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Textarea
                        placeholder="Tell us why you're interested..."
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500 min-h-[80px] pl-9 pt-8 max-h-[150px] overflow-y-auto"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              disabled={loading || success}
              className="w-full py-6 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:from-blue-600 hover:to-teal-500 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submitted Successfully
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Animated error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Success message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start"
        >
          <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">Thank you! Your information has been submitted successfully.</p>
        </motion.div>
      )}

      {/* Social proof element */}
      <motion.div
        variants={itemVariants}
        className="mt-4 text-center"
      >
        <motion.p
          className="text-xs text-gray-500 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span
            className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "loop"
            }}
          />
          Join thousands of students worldwide
        </motion.p>
      </motion.div>
    </motion.div>
  );
}