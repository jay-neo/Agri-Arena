"use client";

import {
  PhoneNavBarChat,
  PhoneNavBarArena,
  PhoneNavBarSocial,
  PhoneNavBarCalender,
  PhoneNavBarActivity,
} from "~/lib/arena-icons";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { isMobile } from "~/lib/utils/checker";
import React, { useEffect, useState } from "react";

interface MobileNavBarItem {
  path: string;
  title: string;
  icon: JSX.Element;
}

export const MobileNavBarSection: MobileNavBarItem[] = [
  {
    title: "Activity",
    path: "/activity",
    icon: (
      <Image
        src={PhoneNavBarActivity}
        alt="activity"
        className="h-6 w-6 dark:invert"
      />
    ),
  },
  {
    title: "Arena",
    path: "/arena",
    icon: (
      <Image
        src={PhoneNavBarArena}
        alt="arena"
        className="h-6 w-6 dark:invert"
      />
    ),
  },
  {
    title: "Chat",
    path: "/chat",
    icon: (
      <Image src={PhoneNavBarChat} alt="chat" className="h-6 w-6 dark:invert" />
    ),
  },
  {
    title: "Calendar",
    path: "/events",
    icon: (
      <Image
        src={PhoneNavBarCalender}
        alt="calender"
        className="h-6 w-6 dark:invert"
      />
    ),
  },
  {
    title: "Social",
    path: "/social",
    icon: (
      <Image
        src={PhoneNavBarSocial}
        alt="social"
        className="h-6 w-6 dark:invert"
      />
    ),
  },
];

export const MobileNavBar = () => {
  const pathname = usePathname();
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // if (!mounted) {
  //   return null;
  // }

  return (
    <>
      {isMobileDevice && (
        <nav className="fixed bottom-0 left-0 right-0 bg-orange-400 shadow-lg items-center dark:bg-[#212146] border-t border-[#1b1b3a]">
          <div className="mx-3 flex justify-between items-baseline h-20">
            {MobileNavBarSection.map((item, index) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  href={item.path}
                  key={index}
                  className="mt-3 flex flex-col items-center"
                >
                  <motion.span
                    className={`py-0.5 px-2 rounded-md ${isActive ? "bg-yellow-300/20 dark:bg-white/5 text-lime-300" : "text-black dark:text-rose-300"} flex flex-col items-center`}
                    animate={isActive ? { scale: 1.4 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {React.cloneElement(item.icon, {
                      className: `${item.icon.props.className} ${isActive ? "text-red-700 dark:text-green-500/80" : "text-black dark:text-rose-300"}`,
                    })}
                  </motion.span>
                  <motion.span
                    className={`text-xs mt-2 text-black dark:text-rose-300 ${isActive ? "" : ""}`}
                    // animate={isActive ? { color: "#84cc16" } : { color: "#9CA3AF" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.title}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};
