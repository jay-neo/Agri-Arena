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

        const images = await db.image.create({
            data: {
                userId: user.id,
                arenaId: arenaId,
            },
            select: {
                id: true,
            },
        });

        await db.imageData.create({
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

        const res: DiseaseDetectionModelResponse =
            await diseaseDetectionModel.processing({ modelId, imageUrl });

        const savedResult = await db.imageProcessingModel.create({
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

        await db.imageData.create({
            data: {
                role: "model",
                type: "text",
                imagesId: images.id,
                modelResponseId: savedResult.id,
            },
            select: {
                id: true,
            },
        });

        doItAsync({
            crop,
            res,
            imagesId: images.id,
        });

        const activity = await createActivity(user.id, "images", images.id);

        return {
            success: "Disease detection is successfully done!",
            next: `/my/activity/${activity}`,
        };
    } catch (error) {
        console.error("Error ==> ", error);
        return { error: error?.message };
    }
}

async function doItAsync(data: {
    crop: string;
    res: DiseaseDetectionModelResponse;
    imagesId: string;
}) {
    try {
        const aiResponse = await db.imageData.create({
            data: {
                role: "ai",
                type: "text",
                imagesId: data.imagesId,
            },
            select: {
                id: true,
            },
        });

        const promptResponse: string[] = await diseaseDetectionModel.prompting(
            data.crop,
            data.res
        );

        await db.imageData.update({
            where: {
                id: aiResponse.id,
            },
            data: {
                text: promptResponse,
            },
            select: {
                id: true,
            },
        });
    } catch (error) {
        throw error;
    }
}
