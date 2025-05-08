"use server";

import { db } from "~/lib/prisma";

export const getImagesDataById = async (id: string) => {
  try {
    console.log("ID", id);
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