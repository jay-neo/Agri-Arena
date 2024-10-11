"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";

export const createLink = async (
  _state: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getUser();
    const idx = formData.get("idx") as string;
    const existedShare = await db.share.findUnique({
      where: {
        idx_userId: {
          idx: Number(idx),
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existedShare) {
      return {
        success: "Already shared this activity.",
        next: existedShare.id,
      };
    }

    const activity = await db.activity.findUnique({
      where: {
        idx_userId: {
          idx: Number(idx),
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!activity) {
      return {
        error: "Oops!! Something went wrong.",
      };
    }
    const newShare = await db.share.create({
      data: {
        idx: Number(idx),
        userId: user.id,
      },
    });

    if (!newShare) {
      return {
        error: "Oops!! Something went wrong.",
      };
    }

    return {
      success: "New sharing link is created.",
      next: newShare.id,
    };
  } catch (error) {
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
