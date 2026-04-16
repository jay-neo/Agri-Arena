"use server";

import { db } from "~/lib/prisma";
import { neoUserSeeds } from "./neoUserSeeds";

export const neoUser = async (userId: string): Promise<boolean> => {
  try {
    const profile = await db.profile.create({
      data: {
        userId: userId,
      },
    });

    const monitor = await db.activity_Monitoring.create({
      data: {
        userId: userId,
      },
    });

    if (!profile || !monitor) {
      return false;
    }

    return neoUserSeeds(userId);
  } catch (error) {
    return false;
  }
};
