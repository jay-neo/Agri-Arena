export default () => {
  return (
    <>
      <div className="contrainer max-w-4xl mx-auto mt-4 p-1">
        <div>
          <span
            className="inline-block h-52 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70"
            style={{
              animationDelay: `${0.05}s`,
              animationDuration: "1s",
            }}
          />
        </div>
        <div className="mt-20 w-full space-y-14">
          <span
            className="inline-block h-10 rounded-full animate-pulse w-9/12 bg-gray-300 dark:bg-slate-700/70"
            style={{
              animationDelay: `${1 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
          <span
            className="inline-block h-10 rounded-full animate-pulse w-10/12 bg-gray-300 dark:bg-slate-700/70"
            style={{
              animationDelay: `${2 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
          <span
            className="inline-block h-10 rounded-full animate-pulse w-8/12 bg-gray-300 dark:bg-slate-700/70 mb-3"
            style={{
              animationDelay: `${3 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
        </div>
        <div className="mt-20 w-full space-y-14 flex flex-col items-end justify-end">
          <div
            className="inline-block h-10 rounded-full animate-pulse w-64 bg-gray-300 dark:bg-slate-700/70"
            style={{
              animationDelay: `${1 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
          <div
            className="inline-block h-10 rounded-full animate-pulse w-80 bg-gray-300 dark:bg-slate-700/70"
            style={{
              animationDelay: `${2 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
          <div
            className="inline-block h-10 rounded-full animate-pulse w-48 bg-gray-300 dark:bg-slate-700/70 mb-3"
            style={{
              animationDelay: `${3 * 0.05}s`,
              animationDuration: "1s",
            }}
          />
        </div>
      </div>
    </>
  );
};
