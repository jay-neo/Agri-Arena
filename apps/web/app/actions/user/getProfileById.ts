"use server";

import { db } from "~/lib/prisma";

export async function getProfileById(username: string): Promise<Profile> {
  try {
    const profile = await db.profile.findUnique({
      where: { username: username },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const res = {
      name: profile?.user?.name,
      email: profile?.user?.email,
      image: profile?.user?.image,
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
