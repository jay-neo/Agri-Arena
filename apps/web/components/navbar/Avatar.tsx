"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { isMobile } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { logout } from "~/app/server/next-auth-v5/logout";
import { NavbarThemeToggleButton } from "./NavbarThemeToggleButton";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
  
const LIST =
  "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white";

export default ({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
  };
}) => {
  const pathname = usePathname();
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!user) {
    return null;
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex text-sm bg-blue-800 rounded-full border-[3px] border-yellow-400 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        <Image
          className="w-8 h-8 rounded-full"
          src={user?.image}
          alt="Avatar"
          height={20}
          width={20}
        />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 z-10 divide-y divide-gray-100 rounded shadow bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="block text-sm">{user.name}</span>
            <span className="block truncate text-sm font-medium">
              {user.email}
            </span>
          </div>

          <ul className="py-1">
            <li role="menuitem">
              <Link href={`/my/profile`} className={LIST}>
                My Profile
              </Link>
            </li>
            {/* <li role="menuitem">
              <Link
                href="/notifications"
                className={LIST}
              >
                Notifications
              </Link>
            </li> */}
            {isMobileDevice && (
              <div className="lg:hidden">
                <li role="menuitem" className={clsx(LIST, "gap-4")}>
                  {"Dark mode"} <NavbarThemeToggleButton />
                </li>
              </div>
            )}
            <div className="my-1 h-px bg-gray-100 dark:bg-gray-600"></div>
            <li role="menuitem">
              <form action={logout}>
                <button type="submit" className={LIST}>
                  {" "}
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
