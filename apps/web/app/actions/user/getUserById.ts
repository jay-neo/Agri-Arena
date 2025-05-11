"use server";

import { db } from "~/lib/prisma";

export const getUserById = async (id: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        email: true,
        image: true,
        profile: {
          select: {
            username: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};
