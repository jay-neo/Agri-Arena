"use server";

import { db } from "~/lib/prisma";
import { ActivityFormSchema, ActivityFormState } from "./validation";
import { revalidatePath } from "next/cache";
import { getUser } from "../user";
import { updateMonitor } from ".";

///////////////////////////////////// CREATE ///////////////////////////////////
export const createActivity = async (
  userId: string,
  type: "experiments" | "predictions" | "images",
  activity: string,
  activityTitle?: string
) => {
  try {
    const monitor = await updateMonitor(userId, type, true);
    const typeId =
      type === "experiments"
        ? "experimentsId"
        : type === "predictions"
          ? "predictionsId"
          : "imagesId";

    const neoActivity = await db.activity.create({
      data: {
        title: activityTitle || "Untitled Activity",
        idx: monitor.activities,
        userId: userId,
        type: type,
        [typeId]: activity,
      },
      select: {
        idx: true,
      },
    });

    return neoActivity.idx;
  } catch (error) {
    return null;
  }
};

///////////////////////////////////// READ ///////////////////////////////////
export const getActivity = async (idx: number) => {
  try {
    const { id } = await getUser();

    const res = await db.activity.findUnique({
      where: {
        idx_userId: {
          idx: idx,
          userId: id,
        },
      },
      select: {
        title: true,
        type: true,
        experimentsId: true,
        predictionsId: true,
        imagesId: true,
        experiments: {
          select: {
            iot: {
              select: {
                title: true,
                device: true,
              },
            },
            arena: {
              select: {
                id: true,
                title: true,
                location: true,
              },
            },
          },
        },
        images: {
          select: {
            arena: {
              select: {
                id: true,
                title: true,
                location: true,
              },
            },
          },
        },
        predictions: {
          select: {
            arena: {
              select: {
                id: true,
                title: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!res) {
      return null;
    }

    return {
      title: res.title,
      type: res.type,
      experimentsId: res?.experimentsId || null,
      predictionssId: res?.predictionsId || null,
      imagesId: res?.imagesId || null,
      arenaId:
        res?.experiments?.arena?.id ||
        res?.images?.arena?.id ||
        res?.predictions?.arena?.id ||
        null,
      arena:
        res?.experiments?.arena?.title ||
        res?.images?.arena?.title ||
        res?.predictions?.arena?.title ||
        null,
      arenaLocation:
        res?.experiments?.arena?.location ||
        res?.images?.arena?.location ||
        res?.predictions?.arena?.location ||
        null,
      iot: res?.experiments?.iot?.title || null,
      device: res?.experiments?.iot?.device || null,
    };
  } catch (error) {
    return null;
  }
};

///////////////////////////////////// UPDATE ///////////////////////////////////
export const updateActivity = async (
  state: ActivityFormState,
  formData: FormData
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
      await db.images.update({
        where: {
          id: activity.imagesId,
        },
        data: {
          arenaId: arena,
        },
      });
    } else if (activity.type === "predictions") {
      await db.predictions.update({
        where: {
          id: activity.predictionsId,
        },
        data: {
          arenaId: arena,
        },
      });
    }

    revalidatePath(`/activity/${validatedFields.data.idx}`);

    return {
      message: "Arena updated successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteActivity = async (idx: number) => {
  try {
    const { id } = await getUser();
    await db.activity.delete({
      where: {
        idx_userId: {
          idx: idx,
          userId: id,
        },
      },
    });
    // redirect(`/activity`);
    return true;
  } catch (error) {
    return false;
  }
};
