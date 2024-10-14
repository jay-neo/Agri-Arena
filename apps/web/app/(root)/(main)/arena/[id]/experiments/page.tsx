import { isNumber } from "~/lib/utils";
import { redirect } from "next/navigation";
import { getArena } from "~/app/server/arena";

import { myenv } from "~/lib/myenv";
import { getFakeIotDataOneYear } from "~/test/data/faker";
import React, { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiments - Arena",
};

import dynamic from "next/dynamic";

const Analytics = dynamic(() => import("./Analytics"), {
  suspense: true,
});

export default async function Page({ params }: { params: { id: string } }) {
  if (!isNumber(params.id)) {
    redirect(`/arena/${params.id}`);
  }
  const { title } =
    myenv === "test"
      ? { title: "Test arena" }
      : await getArena(parseFloat(params.id));

  const lastYearData: any =
    myenv === "test"
      ? await getFakeIotDataOneYear()
      : await getFakeIotDataOneYear();

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <>
      <div className="container mt-2">
        <h2 className="text-2xl text-center font-bold mb-2 truncate">{`${title}'s experiments`}</h2>
        <div className="w-full">
          {lastYearData ? (
            <Suspense fallback={<AnalyticsLoading />}>
              <Analytics data={lastYearData} />
            </Suspense>
          ) : (
            redirect(`/arena/${params.id}`)
          )}
        </div>
      </div>
    </>
  );
}

const AnalyticsLoading: React.FC = () => {
  return (
    <div className="container mx-4 md:mx-8 p-1">
      <ul className="list-disc mt-14 space-y-2">
        <span
          className="inline-block h-[21rem] rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
          style={{
            animationDelay: `1s`,
            animationDuration: "1s",
          }}
        />
      </ul>
    </div>
  );
};
