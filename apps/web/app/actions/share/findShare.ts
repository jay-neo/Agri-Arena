import { db } from "~/lib/prisma";

export const findShare = async (id: string) => {
  try {
    return await db.share.findUnique({
      where: {
        id: id,
      },
      select: {
        idx: true,
        userId: true,
      },
    });
  } catch (error) {
    return null;
  }
};
