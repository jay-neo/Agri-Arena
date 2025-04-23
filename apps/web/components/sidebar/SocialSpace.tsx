"use client";

import { usePathname } from "next/navigation";

import {
  SideBarDiscuss,
  SideBarPages,
  SideBarForecast,
  SideBarNotification,
  SidebarShopingIcon,
} from "~/lib/arena-icons";
import Image from "next/image";
import Link from "next/link";

interface SidebarItem {
  title: string;
  path: string;
  icon: JSX.Element;
}

export const SocialNetworkSection: SidebarItem[] = [
  {
    title: "Discuss",
    path: "/social/posts",
    icon: <Image src={SideBarDiscuss} alt="" className="dark:invert h-5 w-5" />,
  },
  {
    title: "Pages",
    path: "/social/pages",
    icon: <Image src={SideBarPages} alt="" className="dark:invert h-5 w-5" />,
  },
  {
    title: "Forecast",
    path: "/social/forecast",
    icon: (
      <Image src={SideBarForecast} alt="" className="dark:invert h-5 w-5" />
    ),
  },
  {
    title: "Messages",
    path: "/social/messages",
    icon: (
      <Image src={SideBarNotification} alt="" className="dark:invert h-5 w-5" />
    ),
  },
  {
    title: "Store",
    path: "/social/store",
    icon: (
      <Image src={SidebarShopingIcon} alt="" className="dark:invert h-4 w-5" />
    ),
  },
];

export default () => {
  const pathname = usePathname();

  return (
    <ul className="ml-2">
      {SocialNetworkSection.map((item, index) => (
        <li key={index} className="flex items-center py-1">
          <Link
            href={item.path}
            className={`space-x-2 group flex items-center hover:decoration-yellow-400 hover:text-purple-700 dark:hover:text-purple-500`}
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
