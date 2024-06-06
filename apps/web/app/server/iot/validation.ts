import { z } from "zod";

export const IoTFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" })
    .trim(),
  device: z
    .string()
    .min(5, { message: "Device must be at least 5 characters long" })
    .max(30, { message: "Device must be at most 30 characters long" })
    .trim(),
  interval: z
    .number()
    .min(1, { message: "Name must be at least 1 day" })
    .max(30, { message: "Interval must be at most 30 days" }),
  location: z.string().trim().optional(),
  description: z
    .string()
    .max(40, { message: "Name must be at most 40 characters long" })
    .trim()
    .optional(),
  arenaId: z.string().trim().optional(),
});

export type IoTFormState =
  | {
      errors?: {
        title?: string[];
        device?: string[];
        interval?: string[];
        arena?: string[];
        location?: string[];
        description?: string[];
      };
      error?: string;
      message?: string;
      success?: string;
      code?: string;
    }
  | undefined;
