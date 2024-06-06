"use client";

import { usePathname } from "next/navigation";

import {
  SideBarDiscuss,
  SideBarPages,
  SideBarForecast,
  SideBarNotification,
} from "~/lib/arena-icons";
import Image from "next/image";
import Link from "next/link";

interface SidebarItem {
  title: string;
  path: string;
  icon: JSX.Element;
  cName: string;
}

export const SocialNetworkSection: SidebarItem[] = [
  {
    title: "Discuss",
    path: "/social/posts",
    icon: <Image src={SideBarDiscuss} alt="" className="dark:invert h-5 w-5" />,
    cName: "nav-text",
  },
  {
    title: "Pages",
    path: "/social/pages",
    icon: <Image src={SideBarPages} alt="" className="dark:invert h-5 w-4" />,
    cName: "nav-text",
  },
  {
    title: "Forecast",
    path: "/social/forecast",
    icon: (
      <Image src={SideBarForecast} alt="" className="dark:invert h-5 w-5" />
    ),
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/social/messages",
    icon: (
      <Image src={SideBarNotification} alt="" className="dark:invert h-5 w-5" />
    ),
    cName: "nav-text",
  },
];

export default () => {
  const pathname = usePathname();

  return (
    <ul className="">
      {SocialNetworkSection.map((item, index) => (
        <li key={index} className="flex items-center py-1">
          <Link
            href={item.path}
            className={`space-x-2 group flex items-center hover:decoration-yellow-400 hover:text-purple-500 `}
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
        </li>
      ))}
    </ul>
  );
};
