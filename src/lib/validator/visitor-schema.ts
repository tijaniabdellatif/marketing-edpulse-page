import { z } from "zod";

export const OcupationEnum = z.enum([
  "STUDENT",
  "EMPLOYEE",
  "FREELANCER",
  "FREE_OF_FUNCTION",
]);

export type Occupation = z.infer<typeof OcupationEnum>;

export const visitorFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .int()
    .min(12, { message: "You must be at least 12 years old" })
    .max(120, { message: "Age must be less than 120" }),

  occupation: OcupationEnum,
  bio: z
    .string()
    .optional()
});

export type VisitorFormValues = z.infer<typeof visitorFormSchema>;
export const visitorUpdateSchema = visitorFormSchema.partial();
export type VisitorUpdateValues = z.infer<typeof visitorUpdateSchema>;

export const visitorTrackingSchema = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  fingerprint: z.string().optional(),
});

export type VisitorTrackingData = z.infer<typeof visitorTrackingSchema>;

// Combined schema for visitor creation
export const visitorCreateSchema = visitorFormSchema
  .merge(visitorTrackingSchema)
  .extend({
    // Add any additional fields needed for creation
    currentLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    startTime :z.date().optional(),
    endTime:z.date().optional(),
    duration: z.number().optional()

  });

export type VisitorCreateData = z.infer<typeof visitorCreateSchema>;
