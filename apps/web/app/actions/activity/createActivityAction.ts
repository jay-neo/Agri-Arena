"use server";

import { db } from "~/lib/prisma";
import { updateMonitorAction } from "./updateMonitorAction";

export const createActivityAction = async (
  userId: string,
  type: "experiments" | "predictions" | "images",
  activity: string,
  activityTitle?: string,
) => {
  try {
    const monitor = await updateMonitorAction(userId, type, true);
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
