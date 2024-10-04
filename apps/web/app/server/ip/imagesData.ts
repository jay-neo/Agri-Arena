import { db } from "~/lib/prisma";

export const getImagesData = async (id: string) => {
  try {
    return await db.images_Data.findMany({
      where: {
        imagesId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    return null;
  }
};
