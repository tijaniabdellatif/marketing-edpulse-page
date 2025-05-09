import { z } from "zod";

export const bioSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message:
        "Please tell us a bit more about yourself (minimum 10 characters)",
    })
    .max(500, { message: "Bio must be less than 500 characters" }),
});

export type BioFormValues = z.infer<typeof bioSchema>;
