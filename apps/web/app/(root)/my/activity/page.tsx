import type { Metadata } from "next";
import ActivityPreview from "./ActivityPreview";
import { SearchBar } from "~/components/ui/SearchBar";
import { getActivities } from "~/app/actions/activity";
import { SearchTopics, ImageProcessingButton } from "~/components/ui/activity";
import { getActivitiesWithParams } from "~/app/actions/activity/getActivitiesWithParamsAction";

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
  const activityData = await getActivities(
    searchParams.topic,
    searchParams.query,
  );

  return (
    <div className="p-0.5">
      <div className="mt-1 mx-auto max-w-2xl">
        <div className="flex overflow-hidden mx-1 gap-2 items-center justify-center">
          <SearchBar
            placeholder="Search your activities..."
            searchAction={getActivitiesWithParams}
          />
          <ImageProcessingButton />
        </div>
      </div>
      {/* <SearchTopics /> */}
      <div className="flex w-full items-center justify-center flex-col mx-auto max-w-2xl">
        {activityData ? (
          <ActivityPreview
            activityData={activityData}
            searchParams={searchParams}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
