"use server";

import { db } from "~/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUser } from "~/app/server/user";

export async function getArenas(query?: string): Promise<Arenas[] | null> {
  try {
    const user = await getUser();

    const whereClause: Prisma.ArenaWhereInput = {
      userId: user.id,
      OR: query
        ? [
            { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
            {
              location: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
          ]
        : undefined,
    };

    const arenasWithIoTCount = await db.arena.findMany({
      where: whereClause,
      select: {
        idx: true,
        title: true,
        location: true,
        updatedAt: true,
        _count: {
          select: {
            iot: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return arenasWithIoTCount.map((arena) => ({
      idx: arena.idx,
      title: arena.title,
      location: arena.location,
      iots: arena._count.iot,
      updatedAt: arena.updatedAt,
    }));
  } catch (err) {
    return null;
  }
}

export async function getArenasWithParams() {
  revalidatePath(`/arena`);
}
