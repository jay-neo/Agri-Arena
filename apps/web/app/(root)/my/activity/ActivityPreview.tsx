"use client";

import {
  Leaf,
  LandPlot,
  BarChart3,
  Microscope,
  FlaskConical,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { getFormattedDate } from "~/lib/formatters";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import React, { Suspense, useState, useEffect, useRef } from "react";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

// Activity card component
const ActivityCard = React.memo(({ activity }: { activity: Activity }) => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <div className="flex w-full my-4">
        <Link
          href={`activity/${activity.idx}`}
          className={clsx(
            "m-0.5 flex w-full min-w-72 rounded-2xl shadow-surface-elevation-low transition duration-300",
            "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70",
            {
              "bg-green-400/80 hover:bg-green-500/90 dark:bg-green-900/30 dark:hover:bg-green-800/40":
                activity.type === "experiments",
              "bg-blue-400/80 hover:bg-blue-500/90 dark:bg-blue-900/30 dark:hover:bg-blue-800/40":
                activity.type === "predictions",
              "bg-purple-400/80 hover:bg-purple-500/90 dark:bg-purple-900/30 dark:hover:bg-purple-800/40":
                activity.type === "images",
            }
          )}
        >
          {/* Image section */}
          <div className="flex-shrink-0 w-24 md:w-48 rounded-l-2xl overflow-hidden">
            {activity.arenaImage ? (
              <Image
                src={activity.arenaImage}
                alt={activity.arenaImage}
                width={130}
                height={130}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            {/* <div
              className={clsx("absolute bottom-0 left-0 right-0 p-1", {
                "bg-green-600/80 dark:bg-green-800/90":
                  activity.type === "experiments",
                "bg-blue-600/80 dark:bg-blue-800/90":
                  activity.type === "predictions",
                "bg-purple-600/80 dark:bg-purple-800/90":
                  activity.type === "images",
              })}
            >
              {activity.type === "experiments" && (
                <div className="flex items-center justify-center text-white">
                  <FlaskConical size={16} className="mr-1" />
                  <span className="text-xs">Experiment</span>
                </div>
              )}
              {activity.type === "predictions" && (
                <div className="flex items-center justify-center text-white">
                  <BarChart3 size={16} className="mr-1" />
                  <span className="text-xs">Prediction</span>
                </div>
              )}
              {activity.type === "images" && (
                <div className="flex items-center justify-center text-white">
                  <Microscope size={16} className="mr-1" />
                  <span className="text-xs">Analysis</span>
                </div>
              )}
            </div> */}
          </div>

          {/* Content section */}
          <div className="flex flex-col flex-grow p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold dark:text-white line-clamp-2">
                {activity.title}
              </h3>
              <div
                className={clsx("p-2 rounded-full", {
                  "bg-green-500/20 text-green-800 dark:text-green-300":
                    activity.type === "experiments",
                  "bg-blue-500/20 text-blue-800 dark:text-blue-300":
                    activity.type === "predictions",
                  "bg-purple-500/20 text-purple-800 dark:text-purple-300":
                    activity.type === "images",
                })}
              >
                {activity.type === "experiments" && <FlaskConical size={20} />}
                {activity.type === "predictions" && <BarChart3 size={20} />}
                {activity.type === "images" && <Microscope size={20} />}
              </div>
            </div>

            <h2 className="text-base dark:text-gray-300 mb-4 mt-1">
              {activity.type === "experiments" ? (
                <div className="flex items-center">
                  <Leaf
                    size={16}
                    className="mr-2 text-green-700 dark:text-green-400"
                  />
                  <span>Experiments captured from IoT</span>
                </div>
              ) : activity.type === "predictions" ? (
                <div className="flex items-center">
                  <BarChart3
                    size={16}
                    className="mr-2 text-blue-700 dark:text-blue-400"
                  />
                  <span>Crop prediction</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Microscope
                    size={16}
                    className="mr-2 text-purple-700 dark:text-purple-400"
                  />
                  <span>Disease detection</span>
                </div>
              )}
            </h2>

            <div className="mt-auto">
              {activity?.arenaTitle && (
                <div
                  className={clsx("mt-1 p-1 md:p-2 rounded-lg", {
                    "bg-green-200 dark:bg-green-900/30":
                      activity.type === "experiments",
                    "bg-blue-200 dark:bg-blue-900/30":
                      activity.type === "predictions",
                    "bg-purple-200 dark:bg-purple-900/30":
                      activity.type === "images",
                  })}
                >
                  <div className="flex items-center">
                    <LandPlot
                      size={14}
                      className={clsx("mr-2 ", {
                        "text-green-700 dark:text-green-400":
                          activity.type === "experiments",
                        "text-blue-700 dark:text-blue-400":
                          activity.type === "predictions",
                        "text-purple-700 dark:text-purple-400":
                          activity.type === "images",
                      })}
                    />
                    <span
                      className={clsx("text-sm font-mono", {
                        "text-green-800 dark:text-green-300":
                          activity.type === "experiments",
                        "text-blue-800 dark:text-blue-300":
                          activity.type === "predictions",
                        "text-purple-800 dark:text-purple-300":
                          activity.type === "images",
                      })}
                    >
                      {activity?.arenaTitle}
                    </span>
                  </div>
                  {activity?.arenaLocation && (
                    <div
                      className={clsx("text-xs mt-1", {
                        "text-green-700 dark:text-green-400":
                          activity.type === "experiments",
                        "text-plue-700 dark:text-plue-400":
                          activity.type === "predictions",
                        "text-purple-700 dark:text-purple-400":
                          activity.type === "images",
                      })}
                    >
                      {activity?.arenaLocation}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-black dark:text-white">
                  {getFormattedDate(activity.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Suspense>
  );
});

ActivityCard.displayName = "ActivityCard";

const SuspenseFallback = () => {
  return (
    <div className="container flex-col mx-auto max-w-2xl py-1 mt-6">
      <div>
        <ul className="list-disc mt-4 space-y-2">
          <span
            className="inline-block h-36 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
            style={{
              animationDelay: `${0.05}s`,
              animationDuration: "1s",
            }}
          />
        </ul>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col mx-auto max-w-2xl w-full my-4">
      <div className="flex w-full rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-surface-elevation-low">
        {/* Image skeleton */}
        <div className="flex-shrink-0 w-24 md:w-32 rounded-l-2xl bg-gray-300 dark:bg-gray-700 animate-pulse" />

        {/* Content skeleton */}
        <div className="flex flex-col flex-grow p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-3/4" />
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-1/2" />
          <div className="h-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-full" />
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-24" />
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ({ activity }: { activity: Activity }) => {
  const [activities, setActivities] = useState<Activity[]>([activity]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastActivityRef = useRef<HTMLDivElement>(null);

  // Mock function to fetch more activities (replace with actual API call)
  const fetchMoreActivities = async (page: number) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock new data - in real app, this would be an API call
    const newActivities: Activity[] = Array(5)
      .fill(null)
      .map((_, i) => ({
        idx: `new-${page}-${i}`,
        title: `Activity ${page * 5 + i}`,
        type: ["experiments", "predictions", "images"][
          Math.floor(Math.random() * 3)
        ] as Activity["type"],
        updatedAt: new Date(),
        experimentsId: Math.random().toString(36).substring(7),
        predictionsId: Math.random().toString(36).substring(7),
        imagesId: Math.random().toString(36).substring(7),
        arenaImage: `/arena/arena1.png`,
      }));

    return { activities: newActivities, hasMore: page < 5 }; // Limit to 5 pages for demo
  };

  // Handle intersection for infinite scroll
  useEffect(() => {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMoreActivities();
        }
      },
      { threshold: 0.5 }
    );

    if (lastActivityRef.current) {
      currentObserver.observe(lastActivityRef.current);
    }

    observer.current = currentObserver;

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [activities, hasMore, loading]);

  const loadMoreActivities = async () => {
    setLoading(true);
    try {
      const page = Math.ceil(activities.length / 5);
      const { activities: newActivities, hasMore: moreAvailable } =
        await fetchMoreActivities(page);

      setActivities((prev) => [...prev, ...newActivities]);
      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error loading more activities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${openSans.variable} ${robotoMono.variable} font-sans w-full`}
    >
      {activities.map((activity, index) => (
        <div
          key={activity.idx}
          ref={index === activities.length - 1 ? lastActivityRef : null}
        >
          <ActivityCard activity={activity} />
        </div>
      ))}
      {loading && <LoadingSkeleton />}
      {!hasMore && activities.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more activities to load
        </div>
      )}
    </div>
  );
};
