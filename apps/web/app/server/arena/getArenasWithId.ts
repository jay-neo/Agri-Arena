"use server";

import { db } from "~/lib/prisma";
import { getUser } from "~/app/server/user";

export async function getArenasWithId(query?: string): Promise<ArenaIds[]> {
  try {
    const { id } = await getUser();
    const arenas = await db.arena.findMany({
      where: {
        userId: id,
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
    return null;
  }
}
