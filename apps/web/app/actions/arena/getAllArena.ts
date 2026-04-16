// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { Prisma } from "@prisma/client";

export async function getAllArena(
  query?: string,
): Promise<ArenaOverview[] | null> {
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
        currentCrop: true,
        area: true,
        soilType: true,
        image: true,
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
      currentCrop: arena.currentCrop,
      area: arena.area,
      soilType: arena.soilType,
      image: arena.image,
    }));
  } catch (err) {
    return null;
  }
}
