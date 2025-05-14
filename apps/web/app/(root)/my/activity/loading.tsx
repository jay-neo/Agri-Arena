export default function () {
  return (
    <div className="max-h-screen">
      <div className="mt-2 mx-auto max-w-2xl flex items-center justify-center">
        <span
          className="inline-block mx-1 h-12 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
          style={{
            animationDelay: `${1 * 0.05}s`,
            animationDuration: "1s",
          }}
        />
      </div>
      <div className="contrainer max-w-4xl mx-auto py-1 mt-6">
        <div>
          <ul className="list-disc mt-4 space-y-2">
            {[...Array(4).keys()].map((i) => (
              <LoadingSkeleton />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const LoadingSkeleton = () => {
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
