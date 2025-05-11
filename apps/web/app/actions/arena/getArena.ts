// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export const getArena = async (arenaIdx: number, onlyReal?: boolean) => {
  try {
    const { id } = await getUser();
    const arena = await db.arena.findUnique({
      where: {
        idx_userId: {
          idx: arenaIdx,
          userId: id,
        },
        ...(onlyReal && { isReal: true }),
      },
    });

    if (!arena) {
      return null;
    }

    return {
      image: arena.image,
      title: arena.title,
      location: arena.location,
      description: arena.description,

      area: arena.area,
      soilType: arena.soilType,
      currentCrop: arena.currentCrop,

      id: arena.id,
      idx: arena.idx,
      isReal: arena.isReal,
      createdAt: arena.createdAt,
      updatedAt: arena.updatedAt,
    };
  } catch (err) {
    return null;
  }
};
