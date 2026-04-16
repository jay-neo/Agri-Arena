// import "server-only";
"use server";

import { db } from "~/lib/prisma";

export const getExperimentsData = async (id: string) => {
  try {
    return await db.experiments_Data.findMany({
      where: {
        experimentsId: id,
      },
    });
  } catch (error) {
    return null;
  }
};
