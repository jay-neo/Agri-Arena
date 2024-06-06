"use server";

import React from "react";
import Logo from "./logo";
import Avatar from "./Avatar";
import { getUser } from "~/app/server/user";
import LoginButton from "./LoginButton";
import MuiThemeToggleButton from "../providers/mui/MuiThemeToggleButton";

export const Navbar: React.FC = async () => {
  const user = await getUser();

  return (
    <nav className="md:rounded-b-xl bg-orange-400 dark:bg-[#212146] md:bg-[#ddffef] md:border-b md:border-gray-300 md:dark:border-[#212146] ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3 px-2">
        <Logo />

        <div className="flex items-center md:order-2 space-x-5 ">
          <MuiThemeToggleButton/>
          {user ? <Avatar user={user} /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
};
