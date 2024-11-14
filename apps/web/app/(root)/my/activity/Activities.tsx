import { myenv } from "~/lib/myenv";
import { getFakeActivities } from "~/test/data/faker";
import { getActivities } from "~/app/server/activity";
import ActivityPreview from "./ActivityPreview";

export default async ({ topic, query }: { topic?: string; query?: string }) => {
  const activities: Activities[] =
    myenv === "test" ? getFakeActivities() : await getActivities(topic, query);

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <>
      {activities ? (
        activities.map((activity) => (
          <ActivityPreview key={activity.idx} activity={activity} />
        ))
      ) : (
        <></>
      )}
    </>
  );
};
