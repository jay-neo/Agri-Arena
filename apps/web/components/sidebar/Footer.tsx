"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import MuiThemeToggleButton from "../providers/mui/MuiThemeToggleButton";

export default () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col text-sm">
        <p className="text-right mb-20">
          <MuiThemeToggleButton />
        </p>
        <p className="text-right">
          <Link href={`/chat`} className={`rounded-full font-extrabold py-4 px-3 bg-red-500/40 hover:bg-teal-300/40 `}>
            Chat
          </Link>
        </p>
        <p className="text-right mt-10">
          <Link href={`/about`} className={`${pathname.startsWith('/about') ? "text-cyan-500 border-b border-cyan-500" : ""}`}>
            About
          </Link>
          {" | "}
          <Link href={`/support`} className={`${pathname.startsWith('/support') ? "text-cyan-500 border-b border-cyan-500" : ""}`}>
            Support
          </Link>
        </p>

        <p className="text-xs text-right mt-2">
          {currentYear} Agri-Arena © All Rights Reserved
        </p>
      </div>
    </div>
  );
};
