"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export const deleteArenaAction = async (arenaIdx: number) => {
  try {
    const { id } = await getUser();
    const deletedArena = await db.arena.delete({
      where: {
        idx_userId: {
          idx: arenaIdx,
          userId: id,
        },
      },
      select: {
        id: true,
      },
    });
    await db.ioT.updateMany({
      where: {
        arenaId: deletedArena.id,
      },
      data: {
        arenaId: null,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
