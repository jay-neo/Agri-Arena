import clsx from "clsx";
import Link from "next/link";
import React, { Suspense } from "react";
import { getFormattedDate } from "~/lib/formatters";
import { Open_Sans, Roboto_Mono } from "next/font/google";

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

export default async ({ activity }: { activity: Activities }) => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <div className="flex w-full mx-1">
        <Link
          href={`activity/${activity.idx}`}
          className={clsx(
            "block p-4 md:mx-32 my-2 min-w-[22rem] w-full rounded-2xl bg-yellow-400/80 dark:bg-white/5 shadow-surface-elevation-low transition duration-300 hover:bg-yellow-600 dark:hover:bg-white/10 dark:hover:shadow-surface-elevation-medium",
            `focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70`
          )}
        >
          <h3
            className={clsx(
              `truncate text-xl dark:text-rose-100/90 transition duration-300 line-clamp-2 `,
              openSans.className
            )}
          >
            {activity.title}
          </h3>
          <h2
            className={clsx(
              `truncate text-base font-serif dark:text-rose-100/90 transition duration-300 line-clamp-2`,
              robotoMono.className
            )}
          >
            <span>Type of </span>
            <span>{activity.type}</span>
          </h2>
          <div></div>
          <div className="flex flex-row-reverse">
            <p className="mt-4 text-xs dark:text-rose-100/70 line-clamp-3">
              {getFormattedDate(activity.updatedAt)}
            </p>
          </div>
          {activity.type === "experiments" ? (
            <ExperimentsPreview dataId={activity.experimentsId} />
          ) : activity.type === "predictions" ? (
            <PredictionsPreview dataId={activity.predictionsId} />
          ) : activity.type === "images" ? (
            <ImagesPreview dataId={activity.imagesId} />
          ) : (
            <></>
          )}
        </Link>
      </div>
    </Suspense>
  );
};

const SuspenseFallback = () => {
  return (
    <div className="contrainer max-w-4xl mx-auto py-1 mt-6">
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

interface PreviewProps {
  dataId?: string;
}

const ExperimentsPreview: React.FC<PreviewProps> = ({ dataId }) => {
  return <>{dataId}</>;
};

const ImagesPreview: React.FC<PreviewProps> = ({ dataId }) => {
  return <>{dataId}</>;
};

const PredictionsPreview: React.FC<PreviewProps> = ({ dataId }) => {
  return <>{dataId}</>;
};
