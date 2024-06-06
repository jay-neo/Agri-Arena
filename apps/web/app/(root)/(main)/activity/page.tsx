import {
  ActivitySearchBar,
  SearchTopics,
  ImageProcessingButton,
} from "~/components/ui/activity";
import type { Metadata } from "next";
import Activities from "./Activities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Activity",
};

export default async ({
  searchParams,
}: {
  searchParams?: {
    topic?: string;
    query?: string;
  };
}) => {
  return (
    <div className="p-0.5">
      <div className="sticky">
        <div className="relative w-full ">
          <div className="mt-1 mx-auto max-w-2xl">
            <div className="flex overflow-hidden mx-1">
              <ActivitySearchBar />
              <div className="pl-2">
                <ImageProcessingButton />
              </div>
            </div>
          </div>
          <SearchTopics />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <Activities topic={searchParams.topic} query={searchParams.query} />
      </div>
    </div>
  );
};
