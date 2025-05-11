"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";
import { getRandomString } from "~/lib/utils";
import { ArenaSchema, ArenaFormState } from "./arena.schema";
import { updateMonitorAction } from "../activity/updateMonitorAction";
import { defaultArenaAvatar, defaultArenaAvatars } from "~/lib/constants";

// getRandomString from array
const getRandomColorCode = (base: number = 1): string => {
  const colorArray = ["#6363c0", "#e57373", "#81c784", "#64b5f6", "#ffb74d"];

  // Repeat the array `base` times if base > 1
  const expandedArray = Array(base).fill(colorArray).flat();

  const randomIndex = Math.floor(Math.random() * expandedArray.length);
  return expandedArray[randomIndex];
};

export const createArenaAction = async (
  _prevState: ArenaFormState,
  formData: FormData,
): Promise<ArenaFormState> => {
  const validatedFields = ArenaSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    description: formData?.get("description"),
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
    const { title, location, description, currentCrop, area, soilType } =
      validatedFields.data;
    const { id } = await getUser();

    const { arenas } = await updateMonitorAction(id, "arenas");

    if (!arenas) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const colorCode = (await getRandomColorCode(arenas)) as string;
    console.log(" colorCode", colorCode);
    const avatar = defaultArenaAvatars[arenas] || defaultArenaAvatar;

    const arena = await db.arena.create({
      data: {
        userId: id,
        title: title,
        location: location,
        description: description,
        currentCrop: currentCrop,
        area: area,
        soilType: soilType,
        image: avatar,
        colorCode: colorCode ? colorCode : undefined,
        idx: arenas,
      },
    });

    if (!arena) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    revalidatePath(`/my/arena`);

    return {
      message: "Arena created successfully!",
    };
  } catch (error) {
    console.log(" Error creating arena:", error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
