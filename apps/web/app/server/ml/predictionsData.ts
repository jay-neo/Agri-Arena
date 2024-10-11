import { db } from "~/lib/prisma";

export const getPredictionsData = async (id: string) => {
  try {
    return await db.predictions_Data.findMany({
      where: {
        predictionsId: id,
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
