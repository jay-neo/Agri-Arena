"use server";

import { signOut } from "~/auth";

export async function logout() {
  return signOut({
    redirect: true,
    redirectTo: "/login",
  });
}
