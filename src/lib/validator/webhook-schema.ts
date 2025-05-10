// lib/schemas/user-form-schema.ts
import * as z from "zod";

// Define form validation schema
export const visitorFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, {
      message: "Please enter a valid phone number",
    })
    .optional()
    .or(z.literal("")),
  reasons: z
    .string()
    .max(500, { message: "Message must be less than 500 characters" })
    .optional()
    .or(z.literal("")),
  interests: z
    .string()
    .max(500, { message: "Message must be less than 500 characters" })
    .optional()
    .or(z.literal(""))
});

// Export type for the form values
export type VisitorFormValues = z.infer<typeof visitorFormSchema>;
