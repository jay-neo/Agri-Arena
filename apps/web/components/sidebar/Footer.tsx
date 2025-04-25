"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import MuiThemeToggleButton from "../providers/mui/MuiThemeToggleButton";

export default () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <div className="px-4">
      <div className="flex flex-col text-sm">
        <div className="flex flex-col gap-8">
          <p className="text-right">
            <MuiThemeToggleButton />
          </p>
          <p className="text-right">
            <Link
              href={`/chat`}
              className={`rounded-full font-extrabold py-2 px-2 bg-red-500/40 hover:bg-teal-300/40 duration-300 transition-all`}
            >
              Chat
            </Link>
          </p>
        </div>
        <p className="text-right mt-10 text-xs">
          <Link
            href={`/about`}
            className={`${pathname.startsWith("/about") ? "text-cyan-500 border-b border-cyan-500" : ""}`}
          >
            About
          </Link>
          {" | "}
          <Link
            href={`/support`}
            className={`${pathname.startsWith("/support") ? "text-cyan-500 border-b border-cyan-500" : ""}`}
          >
            Support
          </Link>
        </p>

        <p className="text-right mt-0.5" style={{ fontSize: "0.7rem" }}>
          {currentYear} Agri-Arena © All Rights Reserved
        </p>
      </div>
    </div>
  );
};
