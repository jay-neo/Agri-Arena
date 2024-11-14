"use server";

import { NavBar } from "./NavBar";
import { getUser } from "~/app/server/user";

export const Navbar: React.FC = async () => {
  const user = await getUser();

  return <NavBar user={user} />;
};
