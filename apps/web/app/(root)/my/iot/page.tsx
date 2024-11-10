import React from "react";
import { myenv } from "~/lib/myenv";
import type { Metadata } from "next";
import { getIots } from "~/app/server/iot";
import { IoTsTable } from "~/components/ui/iot";
import { getFakeIoTDetails } from "~/test/data/faker";

export const metadata: Metadata = {
  title: "IoTs",
};

export default async () => {
  const data: IoT[] = myenv === "test" ? getFakeIoTDetails() : await getIots();

  return (
    <div className="px-1 py-4">
      <div className="flex items-center justify-center text-3xl text-lime-600 dark:text-fuchsia-400 w-full font-bold mb-3 font-sans">
        IoT Management Dashboard
      </div>
      <IoTsTable initialData={data} />
    </div>
  );
};
