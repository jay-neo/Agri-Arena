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
export const getActivity = async (idx: number, userId?: string) => {
  try {
    userId = !userId ? (await getUser()).id : userId;

    const res = await db.activity.findUnique({
      where: {
        idx_userId: {
          idx: idx,
          userId: userId,
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
            device: true,
            iotTitle: true,
            isPredicted: true,
            iot: {
              select: {
                title: true,
              },
            },
            arena: {
              select: {
                id: true,
                title: true,
                location: true,
              },
            },
            predictions: {
              select: {
                id: true,
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
            experimentsId: true,
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

    // If device name is changed
    // If previously used Device is deleted but the experiments by that device is not deleted
    let iot = res?.experiments?.iotTitle;
    if (res.type === "experiments") {
      const neoTitle = res?.experiments?.iot?.title;
      if (neoTitle && neoTitle !== iot) {
        const updatedExperiment = await db.experiments.update({
          where: {
            id: res?.experimentsId,
          },
          data: {
            iotTitle: neoTitle,
          },
          select: {
            iotTitle: true,
          },
        });

        iot = updatedExperiment.iotTitle;
      }
    }

    // For Predictions type activity find idx of that exeperiment
    const experimentsIdx =
      res.type === "predictions"
        ? await db.activity.findUnique({
          where: {
            experimentsId: res?.predictions?.experimentsId,
          },
          select: {
            idx: true,
          },
        })
        : null;

    const predictionIdx =
      res.type === "experiments" && res.experiments.isPredicted
        ? await db.activity.findUnique({
          where: {
            predictionsId: res.experiments.predictions?.id,
          },
          select: {
            idx: true,
          },
        })
        : null;

    return {
      title: res.title,
      type: res.type,

      experimentsId:
        res.type === "experiments"
          ? res?.experimentsId
          : res.type === "predictions"
            ? res.predictions.experimentsId
            : null,
      isPredicted: res?.experiments?.isPredicted || null,

      predictionsId: res?.predictionsId || null,

      ref:
        res.type === "experiments"
          ? (predictionIdx?.idx as number)
          : res.type === "predictions"
            ? (experimentsIdx?.idx as number)
            : null,

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

      iot: iot || null,
      device: res?.experiments?.device || null,
    } as ActivityHeader;
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

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteActivity = async (
  _state: FormState,
  formData: FormData
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
