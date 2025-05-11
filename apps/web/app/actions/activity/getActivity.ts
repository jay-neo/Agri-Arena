// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

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
