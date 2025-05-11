"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";

export const deleteIotAction = async (iotId: string) => {
  try {
    const { id } = await getUser();
    await db.ioT.delete({
      where: {
        id: iotId,
        userId: id,
      },
    });

    revalidatePath(`/my/iot`);

    return true;
  } catch (error) {
    return false;
  }
};
