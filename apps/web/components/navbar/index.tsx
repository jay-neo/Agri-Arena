"use server";

import React from "react";
import Logo from "./logo";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import { getUser } from "~/app/server/user";
import { ToggleMenuButton } from "./ToggleMenuButton";

export const Navbar: React.FC = async () => {
  const user = await getUser();

  return (
    <nav className="md:rounded-b-xl bg-orange-400 dark:bg-[#212146] md:border-b md:border-black md:dark:border-black ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3 px-2">
        <Logo />

        <div className="flex items-center md:order-2 space-x-5 ">
          <ToggleMenuButton />
          {user ? <Avatar user={user} /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
};
