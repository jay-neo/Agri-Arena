"use server";

import { z } from "zod";
import { db } from "~/lib/prisma";
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
        console.log(formData);
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

        const { modelId, arenaId, modelCetegory, crop, imageUrl } =
            validatedFields.data;

        const res: DiseaseDetectionModelResponse =
            await diseaseDetectionModel.processing({ modelId, imageUrl });

        const promptResponse: string[] = await diseaseDetectionModel.prompting(
            crop,
            res
        );

        const imageId = await db.$transaction(async (tx) => {
            const images = await tx.images.create({
                data: {
                    userId: user.id,
                    arenaId: arenaId,
                },
                select: {
                    id: true,
                },
            });

            await tx.images_Data.create({
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

            const savedResult = await tx.model_v1.create({
                data: {
                    name: modelCetegory,
                    number: res?.number_of_disease,
                    result: res?.result,
                    accuracy: res?.possibility,
                },
                select: {
                    id: true,
                },
            });

            await tx.images_Data.create({
                data: {
                    role: "model",
                    imagesId: images.id,
                    modelResponseId: savedResult.id,
                },
                select: {
                    id: true,
                },
            });

            await tx.images_Data.create({
                data: {
                    role: "ai",
                    imagesId: images.id,
                    text: promptResponse,
                },
                select: {
                    id: true,
                },
            });

            return images.id;
        });

        const activity = await createActivity(user.id, "images", imageId);

        console.log({
            success: "Disease detection is successfully done!",
            next: `/my/activity/${activity}`,
        });
        return {
            success: "Disease detection is successfully done!",
            next: `/my/activity/${activity}`,
        };
    } catch (error) {
        console.error("Error ==> ", error);
        return { error: error?.message };
    }
}
