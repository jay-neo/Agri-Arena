"use server";

import { db } from "~/lib/prisma";

type Monitor = "arenas" | "iots" | "experiments" | "images" | "predictions";

export default async (
  userId: string,
  t: Monitor,
  isNew: boolean = false
): Promise<number | any> => {
  try {
    if (["arenas", "iots"].includes(t)) {
      return await db.activity_Monitoring.upsert({
        where: {
          userId: userId,
        },
        update: {
          [t]: {
            increment: 1,
          },
        },
        create: {
          userId: userId,
          [t]: 1,
        },
        select: {
          [t]: true,
        },
      });
    } else if (["experiments", "images", "predictions"].includes(t)) {
      return await db.activity_Monitoring.upsert({
        where: {
          userId: userId,
        },
        update: {
          activities: {
            increment: isNew ? 1 : 0,
          },
          [t]: {
            increment: 1,
          },
        },
        create: {
          userId: userId,
          activities: 1,
          [t]: 1,
        },
        select: {
          activities: true,
          [t]: true,
        },
      });
    }
  } catch (error) {
    console.error("Error in updateMonitor:", error);
    return null;
  }
};
