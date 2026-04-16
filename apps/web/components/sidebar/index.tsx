// "use server";

import SocialSpace from "./SocialSpace";
import UserSpace from "./UserSpace";
import Footer from "./Footer";
import Image from "next/image";
import { SideBarDividerIcon1 } from "~/lib/arena-icons";

export default () => {
  return (
    <aside className="h-full w-full px-2xl py-2xl md:pl-2xl md:pr-lg border-r border-black">
      <nav className="flex h-[calc(100vh_-_4rem)] flex-col justify-between">
        <div className="pt-6">
          {/* <SocialSpace /> */}

          <ol className="pt-5 flex items-center text-nowrap ml-2">
            <li className="rounded-md border border-black dark:border-yellow-400 p-1.5 dark:shadow-lg dark:shadow-yellow-500/50">
              <Image
                src={SideBarDividerIcon1}
                alt="D"
                className="w-5 h-5 dark:invert"
              />
            </li>

            <li className="border-b border-black p-0 space-x-5 w-full"></li>
          </ol>

          <UserSpace />
        </div>

        <Footer />
      </nav>
    </aside>
  );
};
