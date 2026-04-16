// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export const getIots = async () => {
  try {
    const { id } = await getUser();
    const iots = await db.ioT.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        device: true,
        location: true,
        interval: true,
        createdAt: true,
        status: true,
        arena: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
        description: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return iots.map((iot) => ({
      id: iot.id,

      title: iot.title,
      device: iot.device,
      interval: iot.interval,

      location: iot?.location,
      description: iot?.description,

      arena: iot.arena?.title || undefined,
      arenaId: iot.arena?.id || undefined,
      arenaLocation: iot.arena?.location || undefined,

      status: iot.status,
      createdAt: iot.createdAt,
    }));
  } catch (error) {
    return null;
  }
};
