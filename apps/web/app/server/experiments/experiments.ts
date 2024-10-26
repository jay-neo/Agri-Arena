"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

///////////////////////////////////// GETTER ///////////////////////////////////
export const getExperiments = async (id: string) => {
  try {
    const user = await getUser();
    return await db.experiments.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        createdAt: true,
        updatedAt: true,
        count: true,
        device: true,
      },
    });
  } catch (error) {
    return null;
  }
};

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteExperiments = async (
  experimentsId: string,
  activityIdx: number
) => {
  try {
    const user = await getUser();

    await db.activity.delete({
      where: {
        idx_userId: {
          idx: activityIdx,
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    const deletedExperments = await db.experiments.delete({
      where: {
        id: experimentsId,
        userId: user.id,
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
    if (deletedExperments?.device) {
      const device = await db.ioT.findUnique({
        where: {
          device: deletedExperments.device,
        },
        select: {
          id: true,
        },
      });
      if (device) {
        await db.ioT.update({
          where: {
            id: device.id,
          },
          data: {
            experimentsId: null,
          },
        });
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};
