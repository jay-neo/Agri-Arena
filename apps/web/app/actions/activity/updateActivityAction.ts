"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { ActivityFormSchema, ActivityFormState } from "./activity.schema";
import { revalidatePath } from "next/cache";

export const updateActivityAction = async (
  state: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> => {
  const validatedFields = ActivityFormSchema.safeParse({
    idx: Number(formData.get("idx")),
    title: formData.get("title"),
    arena: formData.get("arena"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { id } = await getUser();
    const activity = await db.activity.update({
      where: {
        idx_userId: {
          idx: validatedFields.data.idx,
          userId: id,
        },
      },
      data: {
        title: validatedFields.data.title,
      },
      select: {
        type: true,
        experimentsId: true,
        predictionsId: true,
        imagesId: true,
      },
    });

    const arena = validatedFields.data.arena
      ? validatedFields.data.arena
      : null;

    if (activity.type === "experiments") {
      await db.experiments.update({
        where: {
          id: activity.experimentsId,
        },
        data: {
          arenaId: arena,
        },
      });
    } else if (activity.type === "images") {
      await db.image.update({
        where: {
          id: activity.imagesId,
        },
        data: {
          arenaId: arena,
        },
      });
    } else if (activity.type === "predictions") {
      await db.prediction.update({
        where: {
          id: activity.predictionsId,
        },
        data: {
          arenaId: arena,
        },
      });
    }

    revalidatePath(`/my/activity/${validatedFields.data.idx}`);

    return {
      success: "Arena updated successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};
