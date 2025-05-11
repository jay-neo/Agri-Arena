"use server";

import { db } from "~/lib/prisma";

export const getImageByImageIdAction = async (imagesId: string) => {
  try {
    const res = await db.imageData.findFirst({
      where: {
        imagesId: imagesId,
        NOT: {
          image: null,
        },
      },
      select: {
        image: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return res.image;
  } catch (error) {
    return null;
  }
};
