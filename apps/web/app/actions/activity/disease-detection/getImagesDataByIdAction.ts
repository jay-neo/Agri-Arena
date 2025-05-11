"use server";

import { db } from "~/lib/prisma";

export const getImagesDataByIdAction = async (id: string) => {
  try {
    return await db.imageData.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return null;
  }
};
