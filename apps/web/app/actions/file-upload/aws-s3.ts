"use server";

import { z } from "zod";
import { getUser } from "~/app/actions/user";
import { s3Service } from "~/server/aws/S3Service";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

type ImageUploadState = FormState & {
  errors?: {
    image?: string[];
  };
  data?: {
    imageUrl: string;
  };
};

const ImageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

export async function fileUploadAction(
  _state: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  console.log("fileUploadAction", formData);
  try {
    const validatedFields = ImageUploadSchema.safeParse({
      image: formData.get("image"),
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const user = await getUser();
    const currentYear = new Date().getFullYear();
    const filePath = `${user.email}/${currentYear}`;
    const imageUrl: string = await s3Service.uploadFile(
      validatedFields.data.image,
      filePath,
    );
    return {
      data: {
        imageUrl: imageUrl,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error?.message,
      };
    } else {
      return {
        error: "Error! We couldn't process your request.",
      };
    }
  }
}
