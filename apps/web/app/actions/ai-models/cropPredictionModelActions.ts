"use server";

import { db } from "~/lib/prisma";
import { getUser } from "~/app/server/user";
import { createActivity } from "~/app/server/activity";
import { revalidatePath } from "next/cache";
import { cropPredictionModel } from "~/server/ai-models/CropPredictionModel";

export const cropPredictionModelActions = async (
    state: FormState,
    formData: FormData
): Promise<FormState> => {
    try {
        const user = await getUser();
        const idx = formData.get("idx");
        const experimentsId = formData.get("experimentsId") as string;
        const arenaId = (formData?.get("arenaId") as string) || null;

        const data = await db.experiments_Data.findMany({
            where: {
                experimentsId: experimentsId,
            },
            select: {
                nitrogen: true,
                phosphorus: true,
                potassium: true,
                ph: true,
                moisture: true,
                temperature: true,
                humidity: true,
                experimentsId: true,
                createdAt: true,
            }
        });
        if (!data) {
            return {
                error: "Oops! No experiments found.",
            };
        }

        const res: CropPredictionModelResponse = await cropPredictionModel.predict({ experimentsData: data });

        const promptResponse: string[] = await cropPredictionModel.prompting(res);
        if (!promptResponse) {
            return {
                error: "Oops! Something went wrong.",
            };
        }

        // Save the all response
        const predictions = await db.prediction.create({
            data: {
                userId: user.id,
                experimentsId: experimentsId,
                arenaId: arenaId,
            },
            select: {
                id: true,
            },
        });

        const savedResult = await db.cropPredictionModel.create({
            data: {
                name: "Crop Prediction",
                number: res?.number_of_crops || 1,
                result: res?.prediction,
                accuracy: res?.confidence,
            },
            select: {
                id: true,
            },
        });
        await db.predictionData.create({
            data: {
                role: "model",
                predictionsId: predictions.id,
                modelResponseId: savedResult.id,
            },
            select: {
                id: true,
            },
        });

        await db.predictionData.create({
            data: {
                predictionsId: predictions.id,
                role: "ai",
                text: promptResponse,
            },
            select: {
                id: true,
            },
        });

        await db.experiments.update({
            where: {
                id: experimentsId,
            },
            data: {
                isPredicted: true,
            },
        });

        const activity = await createActivity(
            user.id,
            "predictions",
            predictions.id
        );
        if (!activity) {
            return {
                error: "Oops! Something went wrong.",
            };
        }

        revalidatePath(`/my/activity/${idx}`);
        return {
            success: "Successfully predict crops for your arena.",
            next: `/my/activity/${activity}`,
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Error! We couldn't process your request.",
        };
    }
};
