import { z } from "zod";

export const ArenaFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be less than 50 characters." }),
  location: z
    .string()
    .trim()
    .min(5, { message: "Location must be at least 5 characters long." })
    .max(50, { message: "Location must be less than 50 characters." }),
  description: z
    .string()
    .trim()
    .max(100, { message: "Description must be less than 100 characters." })
    .optional(),
});

export type ArenaFormState =
  | {
      errors?: {
        title?: string[];
        location?: string[];
        description?: string[];
      };
      error?: string;
      message?: string;
      success?: string;
    }
  | undefined;
