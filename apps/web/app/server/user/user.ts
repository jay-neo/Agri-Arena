"use server";

import { cache } from "react";
import { auth } from "~/auth";
import { db } from "~/lib/prisma";

///////////////////////////////////// GETTER ///////////////////////////////////
export const getUser = cache(async () => {
  try {
    const session = await auth();
    if (session?.user) {
      const user = session?.user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    }
  } catch (error) {
    return null;
  }
});

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

///////////////////////////////////// SETTER ///////////////////////////////////
