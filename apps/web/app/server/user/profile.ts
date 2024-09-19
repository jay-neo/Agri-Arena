"use server";

import { db } from "~/lib/prisma";
import { getUser } from "./user";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";
import { FormState, FormSchema } from "./profile-validation";

///////////////////////////////////// GETTER ///////////////////////////////////
export async function getProfile(): Promise<Profile> {
  try {
    const user = await getUser();
    const { id, name, email, image } = user;

    const profile = await db.profile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
    }

    const res = {
      name: name,
      email: email,
      image: image,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      country: profile?.country,
      pincode: profile?.pincode,
    } as Profile;
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
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
    const { id, email, image: currentImage } = await getUser();

    let avatar: any = currentImage;

    const profile = await db.profile.update({
      where: { userId: id },
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
      const filePath = `${email}/avatar`;
      avatar = await uploadInPublicS3Bucket(
        validatedFields.data?.image,
        filePath
      );
    }

    const updatedUser = await db.user.update({
      where: {
        id: id,
      },
      data: {
        name: validatedFields.data.name,
        ...(avatar !== currentImage && { image: avatar }),
      },
      select: {
        id: true,
      },
    });

    // revalidatePath(`/social/myprofile`);

    if (!updatedUser) {
      return {
        error: "Oops! Something went wrong.",
      };
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
