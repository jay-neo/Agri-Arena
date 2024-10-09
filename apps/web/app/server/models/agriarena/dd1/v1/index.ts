"use server";

import { z } from "zod";
import { db } from "~/lib/prisma";
import { prompting } from "./prompting";
import { processing } from "./processing";
import { getUser } from "~/app/server/user";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";
import { createActivity } from "~/app/server/activity";

export async function diseaseDetection(
  state: DetectionState,
  formData: FormData
): Promise<DetectionState> {
  try {
    // 1. Validating usig Zod
    const validatedFields = ImageUploadSchema.safeParse({
      image: formData.get("image"),
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 2. Uploading in S3
    const user = await getUser();
    const currentYear = new Date().getFullYear();
    const filePath = `${user.email}/${currentYear}`;
    const imageUrl: string = await uploadInPublicS3Bucket(
      validatedFields.data.image,
      filePath
    );
    check(imageUrl);

    // 3. All types of operations (Processing & Prompting)
    const res: Model_Response_T1V1 = await processing(imageUrl);
    check(res);

    const promptResponse: string[] = await prompting(res);
    check(promptResponse);

    // 4. Store all types operations in Database through Buttom-Up Approach
    const images = await db.images.create({
      data: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    check(images);

    const storedImage = await db.images_Data.create({
      data: {
        role: "user",
        type: "image",
        image: imageUrl,
        imagesId: images.id,
      },
      select: {
        id: true,
      },
    });
    check(storedImage);

    const savedResult = await db.model_v1.create({
      data: {
        name: res?.name || null,
        number: res?.number || null,
        result: res?.result || null,
        accuracy: res?.accuracy || null,
      },
      select: {
        id: true,
      },
    });
    check(savedResult);

    const savedResultData = await db.images_Data.create({
      data: {
        role: "model",
        imagesId: images.id,
        modelResponseId: savedResult.id,
      },
      select: {
        id: true,
      },
    });
    check(savedResultData);

    const savedPrompting = await db.images_Data.create({
      data: {
        role: "ai",
        imagesId: images.id,
        text: promptResponse,
      },
      select: {
        id: true,
      },
    });
    check(savedPrompting);

    const activity = await createActivity(user.id, "images", images.id);
    check(activity);

    // redirect(`/activity/${activity}`);

    return {
      success: `/activity/${activity}`,
    };
  } catch (error) {
    console.error("Error ==> ", error);
    if (error instanceof CheckError) {
      return {
        error: error.msg,
      };
    } else {
      return {
        error: "Error! We couldn't process your request.",
      };
    }
  }
}

const check = (s: any) => {
  if (!s) {
    throw new Error("Oops! Something went wrong.");
  }
};

class CheckError extends Error {
  msg: string;
}

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

const ImageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type DetectionState =
  | {
      errors?: {
        image?: string[];
      };
      error?: string;
      pending?: string;
      message?: string;
      success?: string;
    }
  | undefined;
