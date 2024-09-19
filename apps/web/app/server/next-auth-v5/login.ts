"use server";

import { signIn } from "~/auth";
import { SignupFormState, LoginFormSchema } from "./validation";
import { AuthError, CredentialsSignin } from "next-auth";
import { db } from "~/lib/prisma";

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

  try {
    const { email, password } = validatedFields.data;
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        errors: {
          email: ["This email could not register yet."],
        },
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
      // redirectTo: "/activity",
    });

    return {
      success: "Wellcome back in AgriArena!",
    };
  } catch (error) {
    console.log(error);
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
      errors: {
        email: [errorMessage],
        password: [errorMessage],
      },
    };
  }
}
