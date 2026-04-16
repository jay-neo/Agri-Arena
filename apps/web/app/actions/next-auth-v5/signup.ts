"use server";

import bcrypt from "bcrypt";
import { signIn } from "~/auth";
import { db } from "~/lib/prisma";
import { AuthError } from "next-auth";
import { SignupFormState } from "./auth";
import { getRandomString } from "~/lib/utils";
import { RegisterSchema } from "./auth.schema";
import { defaultUserAvatar, defaultUserAvatars } from "~/lib/constants";

export async function signup(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const validatedFields = RegisterSchema.safeParse({
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.$transaction(async (tx) => {
      const { id } = await tx.user.create({
        data: {
          email,
          name: name,
          password: hashedPassword,
          image: getRandomString(defaultUserAvatars) || defaultUserAvatar,
        },
      });

      await tx.account.create({
        data: {
          userId: id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: id,
        },
      });
    });

    // Implement Email Varification OTP

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: "Wellcome to AgriArena!",
    };
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
