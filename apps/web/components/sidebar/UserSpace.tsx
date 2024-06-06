"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SideBarActivity,
  SideBarArena,
  SideBarCalender,
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
    path: "/activity",
    icon: (
      <Image
        src={SideBarActivity}
        alt="activity"
        className="dark:invert h-5 w-4"
      />
    ),
    cName: "nav-text",
  },
  {
    title: "Arena",
    path: "/arena",
    icon: (
      <Image src={SideBarArena} alt="arena" className="dark:invert h-5 w-4" />
    ),
    cName: "nav-text",
  },
  {
    title: "Calender",
    path: "/events",
    icon: (
      <Image
        src={SideBarCalender}
        alt="events"
        className="dark:invert h-5 w-4"
      />
    ),
    cName: "nav-text",
  },
];

export default () => {
  const pathname = usePathname();
  return (
    <>
      {/* <ul className="pt-10 flex items-center text-nowrap">
        <span className="rounded-md border p-1.5">User Space</span>
        <span className="border-b p-0 space-x-5 w-full"></span>
      </ul> */}

      <ul className="pt-4">
        {UserSpaceSection.map((item, index) => (
          <li key={index} className={`px-4 py-1 flex items-center space-x-4`}>
            <span className="flex-grow"> </span>
            <span className="flex-shrink-0">
              <Link
                href={item.path}
                className={`space-x-2 group flex items-center hover:decoration-yellow-400 hover:text-rose-600 `}
              >
                {/* Add hover effect on icon */}
                <span className="group-hover:scale-125 transition-transform duration-200 ease-in-out">
                  {item.icon}
                </span>
                <span
                  className={`${pathname.startsWith(item.path) ? "text-cyan-500 border-b border-cyan-500" : ""}`}
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
