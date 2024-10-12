"use server";

import { db } from "~/lib/prisma";

export const deleteLink = async (
  _state: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const shareId = formData.get("shareId") as string;
    const deletedShare = await db.share.delete({
      where: {
        id: shareId,
      },
      select: {
        id: true,
      },
    });
    if (!deletedShare) {
      return {
        error: "Oops!! Something went wrong.",
      };
    }
    return {
      success: "Successfully link deleted.",
    };
  } catch (err) {
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
