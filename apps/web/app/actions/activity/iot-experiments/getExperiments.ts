// import "server-only";
"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../../user";

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
