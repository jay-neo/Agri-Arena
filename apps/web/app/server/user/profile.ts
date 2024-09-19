"use server";

import { getUser } from "./user";
import { db } from "~/lib/prisma";
import { unstable_update } from "~/auth";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";
import { FormState, FormSchema } from "./profile-validation";
import { revalidatePath } from "next/cache";

///////////////////////////////////// GETTER ///////////////////////////////////
export async function getProfile(): Promise<Profile> {
  try {
    const sessionUser = await getUser();

    const profile = await db.profile.findUnique({
      where: { userId: sessionUser.id },
    });

    const res = {
      name: sessionUser.name,
      email: sessionUser.email,
      image: sessionUser.image,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      country: profile?.country,
      pincode: profile?.pincode,
    } as Profile;

    return res;
  } catch (error) {
    return null;
  }
}

///////////////////////////////////// SETTER ///////////////////////////////////
export async function setProfile(
  state: FormState,
  formData: FormData
): Promise<FormState> {
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
    const currentImage = sessionUser.image;
    let avatar: any = currentImage;

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
      avatar = await uploadInPublicS3Bucket(
        validatedFields.data?.image,
        filePath
      );
    }

    if (
      avatar !== currentImage ||
      sessionUser.name !== validatedFields.data.name
    ) {
      const updatedUser = await db.user.update({
        where: {
          id: sessionUser.id,
        },
        data: {
          name: validatedFields.data.name,
          image: avatar,
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
