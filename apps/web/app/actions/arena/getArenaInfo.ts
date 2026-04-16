// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export async function getArenaInfo(): Promise<ArenaInfo[]> {
  try {
    const user = await getUser();
    const arenas = await db.arena.findMany({
      where: {
        userId: user.id,
        isReal: true,
      },
      select: {
        id: true,
        title: true,
        location: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return arenas.map((arena) => ({
      id: arena.id,
      title: arena.title,
      location: arena.location,
    }));
  } catch (err) {
    console.error(err);
    return null;
  }
}
