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

export const getImagesDataById = async (id: string) => {
  try {
    return await db.imageData.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    return null;
  }
};