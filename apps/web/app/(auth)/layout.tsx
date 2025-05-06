import React from "react";
import { Navbar } from "~/components/navbar";
import { Blobs } from "~/components/ui/blobs";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="sticky container mx-auto min-h-screen">
      <div className="sticky top-0 z-30 h-[4rem] max-w-[1200px] mx-auto items-center justify-between bg-gray-dark-0 px-2xl py-lg">
        <Navbar />
      </div>

      <main className="h-[calc(100vh_-_4rem)] flex items-center justify-center overflow-clip relative">
        {children}
        <Blobs />
      </main>
    </div>
  );
};

export default Layout;
