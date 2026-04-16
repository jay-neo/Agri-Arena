// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export async function getUnassignedIotsForArena() {
  try {
    const { id } = await getUser();
    const iots = await db.ioT.findMany({
      where: {
        arenaId: null,
        userId: id,
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
  } catch (err) {
    return null;
  }
}
