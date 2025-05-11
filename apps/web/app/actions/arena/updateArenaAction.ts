"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { ArenaSchema, ArenaFormState } from "./arena.schema";
import { revalidatePath } from "next/cache";

export const updateArenaAction = async (
  _preState: ArenaFormState,
  formData: FormData,
): Promise<ArenaFormState> => {
  console.log("formData ==>", formData);
  const validatedFields = ArenaSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    description: formData.get("description"),
    currentCrop: formData.get("currentCrop"),
    area: formData.get("area"),
    soilType: formData.get("soilType"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const idx = Number(formData.get("idx"));

    const { id } = await getUser();
    const arena = await db.arena.update({
      where: {
        idx_userId: {
          idx: idx,
          userId: id,
        },
      },
      data: {
        title: validatedFields.data?.title,
        location: validatedFields.data?.location,
        description: validatedFields.data?.description,
        currentCrop: validatedFields.data?.currentCrop,
        area: validatedFields.data?.area,
        soilType: validatedFields.data?.soilType,
      },
      select: {
        id: true,
      },
    });

    if (!arena) {
      return {
        error: "Oops! Something went wrong",
      };
    }

    // const assignedIoTs = formData.getAll("assignedIoTs");
    // const rejectedIoTs = formData.getAll("rejectedIoTs");
    // assignedIoTs.forEach(async (iot, index) => {
    //   await db.ioT.update({
    //     where: {
    //       id: iot as string,
    //     },
    //     data: {
    //       arenaId: arena.id,
    //       status: "active",
    //     },
    //   });
    // });

    // rejectedIoTs.forEach(async (iot, index) => {
    //   await db.ioT.update({
    //     where: {
    //       id: iot as string,
    //     },
    //     data: {
    //       arenaId: null,
    //       status: "inactive",
    //     },
    //   });
    // });

    revalidatePath(`/my/arena/${idx}`);

    return {
      success: "Arena updated successfully!",
      next: `/my/arena/${idx}`,
    };
  } catch (error) {
    console.log("Error ==> ", error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
