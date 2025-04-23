import {
  SearchTopics,
  ActivitySearchBar,
  ImageProcessingButton,
} from "~/components/ui/activity";
import type { Metadata } from "next";
import Activities from "./Activities";
import { SearchBar } from "~/components/ui/SearchBar";

// export const dynamic = "force-static";

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
          <div className="mt-1 mx-auto max-w-2xl">
            <div className="flex overflow-hidden mx-1 gap-2 items-center justify-center">
              <SearchBar placeholder="Search your activities..." />
                <ImageProcessingButton />
            </div>
          </div>
          <SearchTopics />
      <div className="flex w-full items-center justify-center">
        <Activities topic={searchParams.topic} query={searchParams.query} />
      </div>
    </div>
  );
};
