"use server";

import { z } from "zod";
import { db } from "~/lib/prisma";
import { getUser } from "./getUser";
import { unstable_update } from "~/auth";
import { revalidatePath } from "next/cache";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";

export async function setProfile(
  state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
    address: formData.get("address"),
    state: formData.get("state"),
    city: formData.get("city"),
    country: formData.get("country"),
    pincode: formData.get("pincode"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const sessionUser = await getUser();
    const currentImage: string = sessionUser.image;
    let avatar: string = currentImage;

    const profile = await db.profile.update({
      where: { userId: sessionUser.id },
      data: {
        address: validatedFields.data.address,
        city: validatedFields.data.city,
        state: validatedFields.data.state,
        country: validatedFields.data.country,
        pincode: validatedFields.data.pincode,
      },
      select: {
        userId: true,
      },
    });

    if (!profile) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    if (validatedFields.data?.image.size > 0) {
      const filePath = `${sessionUser.email}/avatar`;
      avatar = (await uploadInPublicS3Bucket(
        validatedFields.data?.image,
        filePath,
      )) as string;
    }

    if (
      (avatar as string) !== currentImage ||
      sessionUser.name !== validatedFields.data.name
    ) {
      const updatedUser = await db.user.update({
        where: {
          id: sessionUser.id,
        },
        data: {
          name: validatedFields.data.name,
          image: avatar as string,
        },
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      });

      if (!updatedUser) {
        return {
          error: "Oops! Something went wrong.",
        };
      }

      await unstable_update({
        user: updatedUser,
        // user: {
        //   name: updatedUser.name,
        //   image: updatedUser.image,
        // },
      });

      revalidatePath(`/social/myprofile`);
    }

    return {
      success: "Profile updated successfully!",
    };
  } catch (error) {
    return {
      error: "Error! We couldn't process your request.",
    };
  }
}

///////////////////////////////////////////////////////////////////////
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

const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(20, { message: "Name must be at most 20 characters long." }),
  image: z.any(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  location: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  pincode: z.string().trim().optional(),
});

type ProfileFormState = FormState & {
  errors?: {
    name?: string[];
    image?: string[];
    address?: string[];
    city?: string[];
    state?: string[];
    country?: string[];
    pincode?: string[];
  };
};
