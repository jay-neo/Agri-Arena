"use server";

import { db } from "~/lib/prisma";
import { SignupFormState, SignupFormSchema } from "./validation";
import { signIn } from "~/auth";
import { AuthError } from "next-auth";
import { defaultUserAvatar } from "~/lib/constants";
import { neoUser } from "../user";

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, email, password } = validatedFields.data;

  try {
    const existedUser = await db.user.findUnique({
      where: { email: email },
      select: {
        id: true,
      },
    });
    if (existedUser) {
      return {
        errors: {
          email: ["This email is already used!"],
        },
      };
    }

    const hashedPassword = password;

    const newUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        image: defaultUserAvatar,
      },
    });

    if (!newUser) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    // Implement Email Varification OTP

    await neoUser(newUser.id);

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/activity",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const { type, cause } = error as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials.",
          };
        case "CallbackRouteError":
          return {
            error: cause?.err?.toString(),
          };
        default:
          return {
            error: "Something went wrong.",
          };
      }
    }
  }
}
