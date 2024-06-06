export default function () {
  return (
    <>
      <div className="w-full mx-2 py-1 mt-6">
        <span
          className="inline-block h-24 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70"
          style={{
            animationDelay: `${10 * 0.05}s`,
            animationDuration: "1s",
          }}
        />
        <div>
          <ul className="list-disc mt-4 space-y-2">
            {[...Array(20).keys()].map((i) => (
              <span
              key={i}
                className="inline-block h-60 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
