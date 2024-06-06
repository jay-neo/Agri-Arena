import { z } from "zod";

export const ActivityFormSchema = z.object({
  idx: z
    .number(),
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(30, { message: "Name must be less than 300 characters." })
    .trim(),
  arena: z
    .string()
    .trim()
    .optional(),
});

export type ActivityFormState =
  | {
      errors?: {
        title?: string[];
        arena?: string[];
      };
      error?: string;
      message?: string;      
      success?: string;
    }
  | undefined;
