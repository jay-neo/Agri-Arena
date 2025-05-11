// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { Type } from "@prisma/client";
import { getUser } from "../user/getUser";

const topicEnumMap: Record<string, Type> = {
  images: Type.images,
  predictions: Type.predictions,
  experiments: Type.experiments,
};

export const getActivities = async (
  topic?: string,
  query?: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const { id } = await getUser();
    const activityType = topic ? topicEnumMap[topic] : null;

    let where: any = {
      userId: id,
    };

    if (query && query.trim() != "") {
      const typeSpecificConditions: Record<string, any[]> = {
        experiments: [
          { experiments: { device: { contains: query, mode: "insensitive" } } },
          {
            experiments: {
              arena: { title: { contains: query, mode: "insensitive" } },
            },
          },
          {
            experiments: {
              arena: { location: { contains: query, mode: "insensitive" } },
            },
          },
        ],
        images: [
          {
            images: {
              arena: { title: { contains: query, mode: "insensitive" } },
            },
          },
          {
            images: {
              arena: { location: { contains: query, mode: "insensitive" } },
            },
          },
        ],
        predictions: [
          {
            predictions: {
              arena: { title: { contains: query, mode: "insensitive" } },
            },
          },
          {
            predictions: {
              arena: { location: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      };

      if (activityType) {
        where.type = activityType;
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          ...(typeSpecificConditions[activityType] || []),
        ];
      } else {
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          ...["experiments", "images", "predictions"].map((type) => ({
            type,
            OR: typeSpecificConditions[type],
          })),
        ];
      }
    } else if (activityType) {
      where.type = activityType;
    }

    const fetchedActivities = await db.activity.findMany({
      where,
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
                image: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            arena: {
              select: {
                title: true,
                location: true,
                image: true,
              },
            },
          },
        },
        predictions: {
          select: {
            id: true,
            arena: {
              select: {
                title: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit + 1,
    });

    const hasMore = fetchedActivities.length > limit;
    const activities = hasMore
      ? fetchedActivities.slice(0, limit)
      : fetchedActivities;

    if (!activities || activities.length === 0) {
      return null;
    }

    const transformedActivities: Activity[] = activities.map(
      (activity: any) => {
        const baseActivity = {
          idx: activity.idx,
          title: activity.title,
          type: activity.type,
          updatedAt: activity.updatedAt,
        };

        let arenaData = {
          [`${activity.type}Id`]:
            activity[activity.type]?.device || activity[activity.type].id,
        };

        // if (activity.type === "experiments" && activity.experiments?.arena) {
        //   arenaData = {
        //     experimentsId: activity.experiments.device,
        //     arenaTitle: activity.experiments.arena.title,
        //     arenaLocation: activity.experiments.arena.location,
        //     arenaImage: activity.experiments.arena.image,
        //   };
        // } else if (activity.type === "images" && activity.images?.arena) {
        //   arenaData = {
        //     imagesId: activity.images.id,
        //     arenaTitle: activity.images.arena.title,
        //     arenaLocation: activity.images.arena.location,
        //     arenaImage: activity.images.arena.image,
        //   };
        // } else if (
        //   activity.type === "predictions" &&
        //   activity.predictions?.arena
        // ) {
        //   arenaData = {
        //     predictionsId: activity.predictions.id,
        //     arenaTitle: activity.predictions.arena.title,
        //     arenaLocation: activity.predictions.arena.location,
        //     arenaImage: activity.predictions.arena.image,
        //   };
        // }

        if (activity[activity.type]?.arena) {
          const { arena } = activity[activity.type];
          arenaData.arenaTitle = arena?.title;
          arenaData.arenaLocation = arena?.location;
          arenaData.arenaImage = arena?.image;
        }

        return {
          ...baseActivity,
          ...arenaData,
        };
      },
    );

    return { activities: transformedActivities, hasMore };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { activities: null, hasMore: false };
  }
};
