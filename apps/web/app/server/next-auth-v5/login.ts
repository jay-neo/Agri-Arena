"use server";

import { signIn } from "~/auth";
import { SignupFormState, LoginFormSchema } from "./validation";
import { AuthError, CredentialsSignin } from "next-auth";

export async function login(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/activity",
    });
  } catch (error) {
    const err = error as CredentialsSignin;

    let errorMessage: string;
    if (typeof err.cause === "string") {
      errorMessage = err.cause;
    } else if (err.cause instanceof Error) {
      errorMessage = err.cause.message;
    } else if (typeof err.cause === "object") {
      errorMessage = JSON.stringify(err.cause, null, 2);
    } else {
      errorMessage = "An unknown error occurred";
    }

    return {
      error: errorMessage,
    };
  }
}
