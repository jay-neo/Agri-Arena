"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import clsx from "clsx";
import { getActivitiesWithParams } from "~/app/actions/activity/getActivitiesWithParamsAction";

export default () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const topics = ["all", "experiments", "predictions", "images"];

  const currentTopic = searchParams.get("topic") || "all";

  const handleTopicChange = async (topic: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", lowerTopic);
    }
    replace(`${pathname}?${params.toString()}`);
    await getActivitiesWithParams();
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="mt-1 mx-auto max-w-2xl">
      <div className="flex items-center w-full space-x-4 mr-4 py-2 overflow-x-auto scrollbar-hide">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={clsx(
              "px-4 py-1 rounded-full whitespace-nowrap text-sm",
              currentTopic === topic
                ? "bg-rose-600/70 text-white font-normal"
                : "border-2 border-purple-700 text-rose-400",
            )}
          >
            <span>{capitalize(topic)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
