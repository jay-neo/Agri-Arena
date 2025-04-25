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
    modelId: z.string().min(1, "Model ID is required"),
    arenaId: z.string().min(1, "Arena ID is required"),
    imageUrl: z.string().url("Image URL is required"),
});

export async function diseaseDetectionModelAction(_state: DiseaseDetectionState,
    formData: FormData
): Promise<DiseaseDetectionState> {
    try {
        console.log(formData)
        const user = await getUser();
        const validatedFields = ModelRequestSchema.safeParse({
            modelId: formData.get("modelId"),
            arenaId: formData.get("arenaId"),
            imageUrl: formData.get("imageUrl"),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { modelId, arenaId, imageUrl } = validatedFields.data;

        const res: DiseaseDetectionModelResponse = await diseaseDetectionModel.processing({ modelId, imageUrl });

        const promptResponse: string[] = ["await diseaseDetectionModel.prompting(res);"]

        const images = await db.images.create({
            data: {
                userId: user.id,
            },
            select: {
                id: true,
            },
        });

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

        if (!res?.name || !res?.number || !res?.result || !res?.accuracy) {
            return {
                error: "Error! We couldn't process your request.",
            };
        }


        const savedResult = await db.model_v1.create({
            data: {
                name: res?.name,
                number: res?.number,
                result: res?.result,
                accuracy: res?.accuracy,
            },
            select: {
                id: true,
            },
        });

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

        const activity = await createActivity(user.id, "images", images.id);

        console.log({
            success: "Disease detection is successfully done!",
            next: `/my/activity/${activity}`,
        })
        return {
            success: "Disease detection is successfully done!",
            next: `/my/activity/${activity}`,
        };
    } catch (error) {
        console.error("Error ==> ", error);
        return { error: error?.message };
    }
}

