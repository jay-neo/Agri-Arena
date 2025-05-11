"use server";

import { z } from "zod";

export const contactWithCompany = async (
  state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
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
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().trim().email({ message: "Please enter a valid email." }),
  message: z
    .string()
    .trim()
    .min(5, { message: "Message must be at least 5 characters long." })
    .max(200, { message: "Message must be less than 200 characters." }),
});

type ContactFormState = FormState & {
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};
