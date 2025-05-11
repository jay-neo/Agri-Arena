"use server";

import { db } from "~/lib/prisma";

///////////////////////Get comments////////////////////////

export const getComments = async (postId: number) => {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: true,
      },
    });
    return comments;
  } catch (err) {
    return null;
  }
};
