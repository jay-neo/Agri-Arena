"use server";

import { db } from "~/lib/prisma";
import { updateMonitor } from "../activity";
import { getUser } from "~/app/server/user";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";
import { ImageUploadSchema, ImageUploadState } from "./validation";

export async function uploadS3(
  state: ImageUploadState,
  formData: FormData
): Promise<ImageUploadState> {
  const validatedFields = ImageUploadSchema.safeParse({
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, email } = await getUser();
  const currentYear = new Date().getFullYear();
  const { image } = validatedFields.data;
  const filePath = `${email}/${currentYear}`;
  const imageUrl = await uploadInPublicS3Bucket(image, filePath);

  try {
    const images = await db.images.create({
      data: {
        userId: id,
      },
    });

    const monitor = await updateMonitor(id, "images", true);

    const activity = await db.activity.create({
      data: {
        userId: id,
        idx: Number(monitor.activities),
        type: "images",
        imagesId: images.id,
      },
    });

    const storedImage = await db.images_Data.create({
      data: {
        type: "image",
        image: imageUrl,
        imagesId: images.id,
      },
    });

    if (!storedImage) {
      return {
        error: "An error occurred while creating processing your image",
      };
    }

    // return redirect(`/activity/${activity.idx}`);

    return {
      message: `/activity/${activity.idx}`,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      error: error.message,
    };
  }
}
