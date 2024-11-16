import "server-only";

import { db } from "~/lib/prisma";
import { Type } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUser } from "../user";

const topicEnumMap: Record<string, Type> = {
  images: Type.images,
  predictions: Type.predictions,
  experiments: Type.experiments,
};

export const getActivities = async (topic?: string, query?: string) => {
  try {
    const { id } = await getUser();
    const activityType = topic ? topicEnumMap[topic] : null;

    let activities: any = await db.activity.findMany({
      where: {
        userId: id,
        ...(activityType && { type: activityType }),
      },
      select: {
        idx: true,
        title: true,
        updatedAt: true,
        type: true,
        experiments: {
          select: {
            device: true,
            arena: {
              select: {
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
                title: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!activities || activities.length === 0) {
      return null;
    }

    if (query) {
      activities = activities.filter((activity: any) => {
        // For Activity
        const matchWithActivity = activity.title.includes(query);

        // For Experiments
        const matchWithExperiments =
          activity.type === Type.experiments && activity.experiments
            ? (() => {
                const matchWithDevice =
                  activity.experiments.device.includes(query);
                const matchWithArenaTitle = activity.experiments.arena
                  ? activity.experiments.arena.title.includes(query)
                  : false;
                const matchWithArenaLocation = activity.experiments.arena
                  ? activity.experiments.arena.location.includes(query)
                  : false;

                return (
                  matchWithDevice ||
                  matchWithArenaTitle ||
                  matchWithArenaLocation
                );
              })()
            : null;

        // For Predictions
        const matchWithPredictions =
          activity.type === Type.images &&
          activity.experiments &&
          activity.experiments.arena
            ? activity.experiments.arena.title.includes(query) ||
              activity.experiments.arena.location.includes(query)
            : null;

        // For Images
        const matchWithImages =
          activity.type === Type.images &&
          activity.images &&
          activity.images.arena
            ? activity.images.arena.title.includes(query) ||
              activity.images.arena.location.includes(query)
            : null;

        return (
          matchWithActivity ||
          matchWithExperiments ||
          matchWithPredictions ||
          matchWithImages
        );
      });
    }

    return activities.length ? activities : null;
  } catch (error) {
    return null;
  }
};

export const getActivitiesWithParams = async () => {
  revalidatePath(`/my/activity`);
};
