"use server";

import { z } from "zod";
import { getUser } from "~/app/actions/user";
import { createActivityAction } from "~/app/actions/activity";
import { diseaseDetectionModel } from "~/server/ai-models/DiseaseDetectionModel";

type DiseaseDetectionState = FormState & {
  errors?: {
    imageUrl?: string[];
    modelId?: string[];
  };
};

const ModelRequestSchema = z.object({
  crop: z.string().min(1, "Crop is required"),
  modelId: z.string().min(1, "Model ID is required"),
  arenaId: z.string().optional(),
  modelCetegory: z.string().min(1, "Model category is required"),
  imageUrl: z.string().url("Image URL is required"),
});

export async function diseaseDetectionModelAction(
  _state: DiseaseDetectionState,
  formData: FormData,
): Promise<DiseaseDetectionState> {
  try {
    const user = await getUser();
    const validatedFields = ModelRequestSchema.safeParse({
      modelId: formData.get("modelId"),
      modelCetegory: formData.get("modelCetegory"),
      crop: formData.get("crop"),
      arenaId: formData.get("arenaId"),
      imageUrl: formData.get("imageUrl"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { imagesId, numberOfDisease } = await diseaseDetectionModel.run(
      user,
      validatedFields.data,
    );

    const activity = await createActivityAction(
      user.id,
      "images",
      imagesId,
      numberOfDisease
        ? `Disease found at ${validatedFields.data.crop}`
        : `${validatedFields.data.crop}'s health scan`,
    );

    return {
      success: "Disease detection is successfully done!",
      next: `/my/activity/${activity}`,
    };
  } catch (error) {
    console.error("Error ==> ", error);
    return { error: error?.message };
  }
}
