"use server";

import { cache } from "react";
import { auth } from "~/auth";

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

///////////////////////////////////// SETTER ///////////////////////////////////
