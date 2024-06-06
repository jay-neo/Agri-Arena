"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { deleteActivity } from "../activity";

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
export const deleteExperiments = async (id: string, activityIdx: number) => {
  try {
    const user = await getUser();
    const deletedExperments = await db.experiments.delete({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        device: true,
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
    await deleteActivity(activityIdx);
    return true;
  } catch (error) {
    return false;
  }
};
