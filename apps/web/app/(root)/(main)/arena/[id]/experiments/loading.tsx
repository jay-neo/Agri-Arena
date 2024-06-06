export default function () {
  return (
    <>
      <div className="contrainer mx-4 md:mx-8 p-1">
        <div>
          <ul className="list-disc mt-4 space-y-2 flex items-center justify-center">
            <span
              className="inline-block h-10 rounded-2xl animate-pulse w-56 bg-gray-300 dark:bg-slate-700/70 mb-2"
              style={{
                animationDelay: `0.5s`,
                animationDuration: "1s",
              }}
            />
          </ul>
        </div>
        <div>
          <ul className="list-disc mt-4 space-y-2">
            <span
              className="inline-block h-[21rem] rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
              style={{
                animationDelay: `1s`,
                animationDuration: "1s",
              }}
            />
          </ul>
        </div>
        <div>
          <ul className="list-disc mt-4 space-y-2">
            <span
              className="inline-block h-[21rem] rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
              style={{
                animationDelay: `1.5s`,
                animationDuration: "1s",
              }}
            />
            <span
              className="inline-block h-[21rem] rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
              style={{
                animationDelay: `2s`,
                animationDuration: "1s",
              }}
            />
          </ul>
        </div>
      </div>
    </>
  );
}
