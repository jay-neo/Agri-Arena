"use server";

import { db } from "~/lib/prisma";

export const getArenaDataCount = async (arenaId: string) => {
  try {
    const experiments = await db.experiments.count({
      where: {
        arenaId: arenaId,
      },
    });

    const predictions = await db.predictions.count({
      where: {
        arenaId: arenaId,
      },
    });

    const images = await db.images.count({
      where: {
        arenaId: arenaId,
      },
    });

    return {
      experiments,
      predictions,
      images,
    };
  } catch (error) {
    return {
      experiments: 0,
      predictions: 0,
      images: 0,
    };
  }
};
