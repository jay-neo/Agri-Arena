"use server";

import { z } from "zod";
import { getUser } from "~/app/server/user";
import { createActivity } from "~/app/server/activity";
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
  arenaId: z.string().min(1, "Arena ID is required"),
  modelCetegory: z.string().min(1, "Model category is required"),
  imageUrl: z.string().url("Image URL is required"),
});

export async function diseaseDetectionModelAction(
  _state: DiseaseDetectionState,
  formData: FormData
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

    const imagesId = await diseaseDetectionModel.run(
      user,
      validatedFields.data
    );

    const activity = await createActivity(user.id, "images", imagesId);

    return {
      success: "Disease detection is successfully done!",
      next: `/my/activity/${activity}`,
    };
  } catch (error) {
    console.error("Error ==> ", error);
    return { error: error?.message };
  }
}
