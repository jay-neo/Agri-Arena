"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SideBarIot,
  SideBarArena,
  SideBarEvents,
  SideBarActivity,
} from "~/lib/arena-icons";

interface SidebarItem {
  title: string;
  path: string;
  icon: JSX.Element;
  cName: string;
}

export const UserSpaceSection: SidebarItem[] = [
  {
    title: "Activity",
    path: "/my/activity",
    icon: (
      <Image src={SideBarActivity} alt=">>" className="dark:invert h-5 w-4" />
    ),
    cName: "nav-text",
  },
  {
    title: "Arena",
    path: "/my/arena",
    icon: <Image src={SideBarArena} alt=">>" className="dark:invert h-5 w-4" />,
    cName: "nav-text",
  },
  {
    title: "IoT",
    path: "/my/iot",
    icon: <Image src={SideBarIot} alt=">>" className="dark:invert h-5 w-4" />,
    cName: "nav-text",
  },
  {
    title: "Events",
    path: "/my/events",
    icon: (
      <Image src={SideBarEvents} alt=">>" className="dark:invert h-5 w-4" />
    ),
    cName: "nav-text",
  },
];

export default () => {
  const pathname = usePathname();
  return (
    <>
      <ul className="pt-4">
        {UserSpaceSection.map((item, index) => (
          <li
            key={index}
            className={`px-4 py-1.5 flex items-center space-x-4 text-base`}
          >
            <span className="flex-grow"> </span>
            <span className="flex-shrink-0">
              <Link
                href={item.path}
                className={`space-x-2 group flex items-center hover:text-rose-600 `}
              >
                <span className="group-hover:scale-125 transition-transform duration-200 ease-in-out">
                  {item.icon}
                </span>
                <span
                  className={`${pathname.startsWith(item.path) ? "dark:text-yellow-400 text-cyan-500 border-b border-dashed dark:border-yellow-400 border-cyan-500" : ""}`}
                >
                  {item.title}
                </span>
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
