"use client";

import Image from "next/image";
import { Google } from "~/lib/arena-icons";
import { Button } from "~/components/ui/form/button";

export default () => {
  return (
    <Button
      type="submit"
      className="flex items-center gap-2 font-semibold border rounded-lg py-2 px-5 hover:bg-lime-400 hover:text-black"
    >
      <Image src={Google} alt="G" width={20} height={20} />
      <span>Login with Google</span>
    </Button>
  );
};
