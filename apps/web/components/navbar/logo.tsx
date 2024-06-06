"use client";

import Image from "next/image";
import { Logo } from "~/lib/arena-icons";

export default function () {
  return (
    <>
      <div className="flex flex-row items-center justify-center text-2xl font-semibold dark:text-white">
        <Image
          src={Logo}
          width={38}
          height={38}
          alt="A"
          className="hidden md:block"
        />
        <span className="ml-0.5">AgriArena</span>
      </div>
    </>
  );
}
