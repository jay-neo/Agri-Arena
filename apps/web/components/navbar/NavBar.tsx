"use client";

import React from "react";
import Logo from "./logo";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import { ToggleMenuButton } from "./ToggleMenuButton";
import { usePathname } from "next/navigation";

export const NavBar = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
  };
}) => {
  const pathname = usePathname();

  return (
    <nav
      className={`lg:rounded-b-xl bg-orange-400 dark:bg-[#212146] md:border-b md:border-black ${pathname.startsWith("/my/") ? `md:dark:border-rose-500` : pathname.startsWith("/social/") && "md:dark:border-purple-500"}`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3 px-2">
        <Logo />

        <div className="flex items-center md:order-2 space-x-5 ">
          <ToggleMenuButton isAuthenticated={user ? true : false} />
          {user ? <Avatar user={user} /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
};
