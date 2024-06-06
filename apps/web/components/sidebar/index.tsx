"use server";

import SocialSpace from "./SocialSpace";
import UserSpace from "./UserSpace";
import Footer from "./Footer";


export default  async () => {
  return (
    <aside className="h-full w-full px-2xl py-2xl md:pl-2xl md:pr-lg border-r border-black">
      <nav className="flex !min-h-full flex-col justify-between">
        <div className="pt-6">
          <SocialSpace/>

          <ol className="pt-10 flex items-center text-nowrap">
            <li className="rounded-md border border-black p-1.5">User Space</li>
            <li className="border-b border-black p-0 space-x-5 w-full"></li>
          </ol>

          <UserSpace/>
        </div>

        <Footer/>        
      </nav>
    </aside>
  );
};

