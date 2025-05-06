import { myenv } from "~/lib/myenv";
import type { Metadata } from "next";
import { SearchBar } from "~/components/ui/SearchBar";
import { SearchTopics, ImageProcessingButton } from "~/components/ui/activity";
import ActivityPreview from "./ActivityPreview";
import { getFakeActivities } from "~/test/data/faker";
import { getActivities } from "~/app/server/activity";

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
  const activities: Activity[] =
    myenv === "test"
      ? getFakeActivities()
      : await getActivities(searchParams.topic, searchParams.query);

  return (
    <div className="p-0.5">
      <div className="mt-1 mx-auto max-w-2xl">
        <div className="flex overflow-hidden mx-1 gap-2 items-center justify-center">
          <SearchBar placeholder="Search your activities..." />
          <ImageProcessingButton />
        </div>
      </div>
      <SearchTopics />
      <div className="flex w-full items-center justify-center flex-col mx-auto max-w-2xl">
        {activities ? (
          activities.map((activity) => (
            <ActivityPreview key={activity.idx} activity={activity} />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
