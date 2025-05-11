"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";

export const deleteActivityAction = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  try {
    const idx = formData.get("idx") as string;
    const { id } = await getUser();
    const deletedActivity = await db.activity.delete({
      where: {
        idx_userId: {
          idx: Number(idx),
          userId: id,
        },
      },
    });
    if (deletedActivity.type === "experiments") {
      await db.experiments.delete({
        where: {
          id: deletedActivity.experimentsId,
        },
        include: {
          expData: true,
          predictions: {
            include: {
              predictionsData: {
                include: {
                  modelResponse: true,
                },
              },
            },
          },
        },
      });
    } else if (deletedActivity.type === "predictions") {
      const deletedPredictions = await db.prediction.delete({
        where: {
          id: deletedActivity.predictionsId,
        },
        include: {
          predictionsData: {
            include: {
              modelResponse: true,
            },
          },
        },
      });
      await db.experiments.update({
        where: {
          id: deletedPredictions.experimentsId,
        },
        data: {
          isPredicted: false,
        },
      });
    } else if (deletedActivity.type === "images") {
      await db.image.delete({
        where: {
          id: deletedActivity.imagesId,
        },
        include: {
          imagesData: {
            include: {
              modelResponse: true,
            },
          },
        },
      });
    }

    revalidatePath(`/my/activity`);
    return {
      success: "",
      next: "/my/activity",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "",
    };
  }
};
