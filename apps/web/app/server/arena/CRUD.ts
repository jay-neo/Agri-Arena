"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { defaultArenaAvatar, defaultArenaAvatars } from "~/lib/constants";
import { updateMonitor } from "~/app/server/activity";
import { ArenaFormSchema, ArenaFormState } from "./validation";
import { getRandomString } from "~/lib/utils/random";

///////////////////////////////////// CREATE ///////////////////////////////////
export const createArena = async (
  state: ArenaFormState,
  formData: FormData
): Promise<ArenaFormState> => {
  const validatedFields = ArenaFormSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    description: formData?.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const { title, location, description } = validatedFields.data;
    const { id } = await getUser();

    const { arenas } = await updateMonitor(id, "arenas");

    if (!arenas) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const arena = await db.arena.create({
      data: {
        userId: id,
        title: title,
        location: location,
        description: description,
        image: getRandomString(defaultArenaAvatars) || defaultArenaAvatar,
        idx: arenas,
      },
    });

    if (!arena) {
      return {
        error: "Oops! Something went wrong",
      };
    }

    revalidatePath(`/arena`);

    return {
      message: "Arena created successfully!",
    };
  } catch (error) {
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};

///////////////////////////////////// READ ///////////////////////////////////
export const getArena = async (arenaIdx: number) => {
  try {
    const { id } = await getUser();
    const arena = await db.arena.findUnique({
      where: {
        idx_userId: {
          idx: arenaIdx,
          userId: id,
        },
      },
    });

    if (!arena) {
      return null;
    }
    return {
      id: arena.id,
      title: arena.title,
      image: arena.image,
      location: arena.location,
      description: arena.description,
      createdAt: arena.createdAt,
    };
  } catch (err) {
    return null;
  }
};

///////////////////////////////////// UPDATE ///////////////////////////////////
export const updateArena = async (
  state: ArenaFormState,
  formData: FormData
): Promise<ArenaFormState> => {
  const validatedFields = ArenaFormSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { title, location, description } = validatedFields.data;
  const idx = Number(formData.get("idx"));
  const assignedIoTs = formData.getAll("assignedIoTs");
  const rejectedIoTs = formData.getAll("rejectedIoTs");

  try {
    const { id } = await getUser();
    const arena = await db.arena.update({
      where: {
        idx_userId: {
          idx: idx,
          userId: id,
        },
      },
      data: {
        title: title,
        location: location,
        description: description,
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

    assignedIoTs.forEach(async (iot, index) => {
      await db.ioT.update({
        where: {
          id: iot as string,
        },
        data: {
          arenaId: arena.id,
          status: "active",
        },
      });
    });

    rejectedIoTs.forEach(async (iot, index) => {
      await db.ioT.update({
        where: {
          id: iot as string,
        },
        data: {
          arenaId: null,
          status: "inactive",
        },
      });
    });

    revalidatePath(`/arena/${idx}`);
    return {
      message: "Arena updated successfully!",
    };
  } catch (error) {
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteArena = async (arenaId: string) => {
  try {
    const { id } = await getUser();
    await db.arena.delete({
      where: {
        id: arenaId,
        userId: id,
      },
    });
    redirect(`/arena`);
    return true;
  } catch (error) {
    return false;
  }
};
