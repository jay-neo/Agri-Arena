// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export async function getAssignedIotsForArena(arenaId: string) {
  try {
    const { id } = await getUser();
    const iots = await db.ioT.findMany({
      where: {
        AND: [{ userId: id }, { arenaId: arenaId }],
      },
    });

    if (!iots) {
      return null;
    }
    return iots.map((iot) => ({
      id: iot.id,
      title: iot.title,
      device: iot.device,
    }));
  } catch (error) {
    return null;
  }
}
