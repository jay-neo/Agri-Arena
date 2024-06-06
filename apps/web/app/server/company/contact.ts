"use server";

import { z } from "zod";

export const contactWithCompany = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const validatedFields = FormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // const { name, email, message } = validatedFields.data;

    // implement send the message to the company

    return {
      success: "Message send successfully.",
    };
  } catch (error) {
    return {
      error: "We couldn't process your request.",
    };
  }
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters long." })
    .max(200, { message: "Message must be less than 200 characters." })
    .trim(),
});

type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
      };
      error?: string;
      message?: string;
      success?: string;
    }
  | undefined;
