"use server";

import { z } from "zod";
import { db } from "~/lib/prisma";

const DeleteFormSchema = z.object({
  id: z.string().uuid(),
});

export const deleteEventAction = async (eventId: string) => {
  try {
    const validatedFields = DeleteFormSchema.safeParse({
      id: eventId,
    });

    if (!validatedFields.success) {
      console.log("Validation Error =>", {
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return false;
    }

    await db.event.delete({
      where: {
        id: validatedFields.data.id,
      },
    });
    return true;
  } catch (error) {
    console.log(" Error deleting event: ", error);
    return false;
  }
};
