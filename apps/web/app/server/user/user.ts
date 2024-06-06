"use server";

import { auth } from "~/auth";

///////////////////////////////////// GETTER ///////////////////////////////////
export async function getUser() {
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
}

///////////////////////////////////// SETTER ///////////////////////////////////
