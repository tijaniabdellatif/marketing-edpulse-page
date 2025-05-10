// lib/validator/webhook-schema.ts

import * as z from "zod";
import { InterestType, PreferenceType, Occupation } from "@prisma/client";

// Base schema with string interests/preferences for backward compatibility
export const visitorFormSchema = z.object({
  // Required fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  
  // Optional fields
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  age: z.number().positive("Age must be a positive number").optional(),
  reasons: z.string().optional().or(z.literal("")),
  
  // Keep as string for backward compatibility
  interests: z.string().optional().or(z.literal("")),
  preferences: z.string().optional().or(z.literal("")),
  
  // Optional occupation from enum
  occupation: z.nativeEnum(Occupation).optional(),
  
  // Company info
  company: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  
  // Form analytics - for internal use, not validated on client
  timeSpent: z.number().optional(),
  lastFieldSeen: z.string().optional(),
  isPartial: z.boolean().optional(),
});

export type VisitorFormValues = z.infer<typeof visitorFormSchema>;

// New schema with array interests/preferences for the multiple-choice UI
export const multiSelectVisitorFormSchema = z.object({
  // Required fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  
  // Optional fields
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  age: z.number().positive("Age must be a positive number").optional(),
  reasons: z.string().optional().or(z.literal("")),
  
  // Array types for multiple choice
  interests: z.array(z.nativeEnum(InterestType)).optional(),
  preferences: z.array(z.nativeEnum(PreferenceType)).optional(),
  
  // Optional occupation from enum
  occupation: z.nativeEnum(Occupation).optional(),
  
  // Company info
  company: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  
  // Form analytics - for internal use, not validated on client
  timeSpent: z.number().optional(),
  lastFieldSeen: z.string().optional(),
  isPartial: z.boolean().optional(),
});

export type MultiSelectVisitorFormValues = z.infer<typeof multiSelectVisitorFormSchema>;

// Extended form with analytics and session data that will be sent to the API
export const extendedVisitorFormSchema = multiSelectVisitorFormSchema.extend({
  // Session data
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  ipAddress: z.string().optional().nullable(),
  
  // UTM parameters
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
});

export type ExtendedVisitorFormValues = z.infer<typeof extendedVisitorFormSchema>;