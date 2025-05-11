"use server";

import { db } from "~/lib/prisma";

export const getAgricultureSchema = async () => {
  try {
    return await db.forecastAgricultureSchema.findMany();
  } catch (error) {
    return [];
  }
};
