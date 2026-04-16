import { z } from "zod";

export const ArenaSchema = z.object({
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
  area: z
    .string()
    .trim()
    .max(100, { message: "Description must be less than 100 characters." })
    .optional(),
  currentCrop: z
    .string()
    .trim()
    .max(100, { message: "Description must be less than 100 characters." })
    .optional(),
  soilType: z
    .string()
    .trim()
    .max(100, { message: "Description must be less than 100 characters." })
    .optional(),
});

export type ArenaFormState = FormState & {
  errors?: {
    title?: string[];
    location?: string[];
    description?: string[];
    currentCrop?: string[];
    area?: string[];
    soilType?: string[];
  };
};
