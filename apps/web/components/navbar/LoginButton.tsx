"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default () => {
    const currentPath = usePathname();
    const isSignInOrLoginPage =
    currentPath === "/signup" || currentPath === "/login";


  return (
    !isSignInOrLoginPage && (
      <Link
        className=" dark:border-sky-200 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f] rounded-md border px-3 py-1.5 text-sm font-medium transition-colors border-yellow-900 hover:bg-black dark:hover:bg-slate-600 hover:text-white hover:shadow-lg hover:shadow-gray-400 dark:hover:shadow-yellow-400"
        href="/login"
      >
        Login
      </Link>
    )
  );
};
