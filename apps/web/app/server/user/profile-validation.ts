import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

/**
 * 
 * var File: {
    new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
    prototype: File;
  };
 * 
 * image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png formats are supported."
        ),
      z.instanceof(File).nullable(),
    ])
    .optional(),
 * 
 */

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(20, { message: "Name must be at most 20 characters long." })
    .trim(),
  image: z.any(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  location: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  pincode: z.string().trim().optional(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        image?: string[];
        address?: string[];
        city?: string[];
        state?: string[];
        country?: string[];
        pincode?: string[];
      };
      error?: string;
      message?: string;
      success?: string;
    }
  | undefined;
