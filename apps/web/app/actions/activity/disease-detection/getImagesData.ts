// import "server-only"
"use server";

import { db } from "~/lib/prisma";

export const getImagesData = async (id: string) => {
  try {
    return await db.imageData.findMany({
      where: {
        imagesId: id,
      },
      include: {
        modelResponse: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    return null;
  }
};
