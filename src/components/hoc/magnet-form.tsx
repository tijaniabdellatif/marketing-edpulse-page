'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Rocket, Lock, Mail, Phone, MessageSquare, BookOpen, Briefcase, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { multiSelectVisitorFormSchema, type MultiSelectVisitorFormValues } from '@/lib/validator/webhook-schema';
import { InterestType, PreferenceType, Occupation, SubmissionStatus } from '@prisma/client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MagnetFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Extended form values to include all possible fields from API and service
interface ExtendedFormValues extends MultiSelectVisitorFormValues {
  isPartial?: boolean;
  lastFieldSeen?: string;
  timeSpent?: number;
}

export default function MagnetForm({ onSuccess, onError }: MagnetFormProps) {
  // Status states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Time tracking
  const startTimeRef = useRef<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [lastFieldSeen, setLastFieldSeen] = useState<string>('');
  
  // UTM parameters
  const [utmParams, setUtmParams] = useState({
    utmSource: "",
    utmMedium: "",
    utmCampaign: ""
  });
  
  // Get UTM parameters from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const utmSource = url.searchParams.get('utm_source');
      const utmMedium = url.searchParams.get('utm_medium');
      const utmCampaign = url.searchParams.get('utm_campaign');
      
      setUtmParams({
        utmSource: utmSource || "",
        utmMedium: utmMedium || "",
        utmCampaign: utmCampaign || ""
      });
    }
  }, []);
  
  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeSpentInSeconds = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
      setTimeSpent(timeSpentInSeconds);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track the last field the user interacted with
  const handleFieldFocus = (fieldName: string) => {
    setLastFieldSeen(fieldName);
  };

  // Initialize react-hook-form with zod validation
  const form = useForm<ExtendedFormValues>({
    resolver: zodResolver(multiSelectVisitorFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      reasons: "",
      interests: [], // Initialize as empty array
      preferences: [], // Initialize as empty array
      age: undefined,
      occupation: undefined,
      company: "",
      department: ""
    },
  });

  // Send partial form data if the user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only send partial submission if the form is not submitted successfully
      // and they've started filling out the form
      if (!success && form.getValues().firstName) {
        sendPartialSubmission();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [success]);
  
  // Send partial form data
  const sendPartialSubmission = async () => {
    try {
      const formData = form.getValues();
      
      // Only send if at least first name is filled
      if (!formData.firstName) return;
      
      // Add time tracking info and session info
      const partialData = {
        ...formData,
        timeSpent,
        lastFieldSeen,
        isPartial: true,
        
        // Browser information
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        
        // UTM parameters
        ...utmParams
      };
      
      // Send partial submission - using navigator.sendBeacon for reliability during page unload
      const blob = new Blob([JSON.stringify(partialData)], {
        type: 'application/json'
      });
      
      navigator.sendBeacon('/api/pabbly/partial', blob);
    } catch (error) {
      console.error('Error sending partial submission:', error);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ExtendedFormValues) => {
    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('Submitting form data:', data);
      
      // Add time tracking data and session info
      const enrichedData = {
        ...data,
        timeSpent,
        lastFieldSeen,
        
        // Browser information
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ipAddress: null, // Will be determined server-side
        
        // UTM parameters
        ...utmParams
      };

      // Send to our API route
      const response = await axios.post('/api/pabbly', enrichedData);

      console.log('Form submission response:', response.data);

      // Set success state
      setSuccess(true);

      // Clear form
      form.reset();
      
      // Reset time tracking
      startTimeRef.current = new Date();
      setTimeSpent(0);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting form:', err);

      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
        
        // If the error is related to CORS, provide a more helpful message
        if (err.message.includes('CORS') || err.message.includes('Network Error')) {
          errorMessage = 'Cannot reach our service. This might be due to network issues.';
        }
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

  // Available options for interests and preferences
  const interestOptions = Object.values(InterestType).map(value => ({
    id: value,
    label: value.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }));

  const preferenceOptions = Object.values(PreferenceType).map(value => ({
    id: value,
    label: value.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }));

  // Occupation options
  const occupationOptions = Object.values(Occupation);

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
                        onFocus={() => handleFieldFocus('firstName')}
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
                        onFocus={() => handleFieldFocus('lastName')}
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
                        onFocus={() => handleFieldFocus('email')}
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
                        onFocus={() => handleFieldFocus('phone')}
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

          {/* Age Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>Age</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Your age"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="border-gray-300 focus-visible:ring-blue-500 pl-9"
                        onFocus={() => handleFieldFocus('age')}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Occupation Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1">
                      <span>Occupation</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    onOpenChange={() => handleFieldFocus('occupation')}
                  >
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 z-10" />
                        <SelectTrigger className="border-gray-300 focus-visible:ring-blue-500 pl-9">
                          <SelectValue placeholder="Select your occupation" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      {occupationOptions.map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation.charAt(0).toUpperCase() + occupation.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Company and Department Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Company Field */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center space-x-1">
                        <span>Company</span>
                        <span className="text-gray-400 text-xs">(Optional)</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your company"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500"
                        onFocus={() => handleFieldFocus('company')}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Department Field */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center space-x-1">
                        <span>Department</span>
                        <span className="text-gray-400 text-xs">(Optional)</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your department"
                        {...field}
                        className="border-gray-300 focus-visible:ring-blue-500"
                        onFocus={() => handleFieldFocus('department')}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal" />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

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
                        onFocus={() => handleFieldFocus('reasons')}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Interests Field as Multiple Choice */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1 mb-2">
                      <span>What topics are you interested in?</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <div 
                    className="border rounded-md border-gray-300 p-3 space-y-3"
                    onFocus={() => handleFieldFocus('interests')}
                  >
                    {interestOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={Array.isArray(field.value) && field.value.includes(option.id as InterestType)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = Array.isArray(field.value) ? field.value : [];
                                    return checked
                                      ? field.onChange([...currentValues, option.id])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs font-normal" />
                </FormItem>
              )}
            />
          </motion.div>
          
          {/* Preferences Field as Multiple Choice */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                  <FormLabel>
                    <span className="flex items-center space-x-1 mb-2">
                      <span>Learning preferences</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </span>
                  </FormLabel>
                  <div 
                    className="border rounded-md border-gray-300 p-3 space-y-3"
                    onFocus={() => handleFieldFocus('preferences')}
                  >
                    {preferenceOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="preferences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={Array.isArray(field.value) && field.value.includes(option.id as PreferenceType)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = Array.isArray(field.value) ? field.value : [];
                                    return checked
                                      ? field.onChange([...currentValues, option.id])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
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
    </motion.div>
  );
}