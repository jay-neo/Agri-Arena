import { Metadata } from "next";
import React from "react";
import { Navbar } from "~/components/navbar";
import { MobileNavBar } from "~/components/navbar/MobileNavBar";
import Sidebar from "~/components/sidebar";
import { getUser } from "../server/user";

interface LayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  "use server";
  const user = await getUser();

  return {
    title: {
      default: `${user?.name}`,
      template: `%s | ${user?.name} - AgriArena`,
    },
  };
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="sticky container mx-auto min-h-screen">
      <div className="sticky top-0 z-30 h-[4rem] max-w-[1600px] items-center justify-between bg-gray-dark-0 px-2xl py-lg">
        <Navbar />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[1600px]">
        <aside className="sticky top-[4rem] hidden h-[calc(100vh_-_4rem)] max-h-screen w-1/5 shrink-0 basis-1/5 bg-gray-dark-0 lg:block">
          <Sidebar />
        </aside>

        <div className="mt-xl w-1/2 flex-1 lg:mt-2xl pt-2 md:px-6 mb-24">
          {children}
        </div>
      </div>

      <div className="block md:hidden">
        <MobileNavBar />
      </div>
    </div>
  );
};

export default Layout;
