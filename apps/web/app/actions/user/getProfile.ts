// import "server-only";

import { db } from "~/lib/prisma";
import { getUser } from "./getUser";

export async function getProfile(): Promise<Profile> {
  try {
    const sessionUser = await getUser();

    const profile = await db.profile.findUnique({
      where: { userId: sessionUser.id },
    });

    const res = {
      name: sessionUser.name,
      email: sessionUser.email,
      image: sessionUser.image,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      country: profile?.country,
      pincode: profile?.pincode,
    } as Profile;

    return res;
  } catch (error) {
    return null;
  }
}
