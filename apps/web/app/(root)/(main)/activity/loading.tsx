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
            {[...Array(5).keys()].map((i) => (
              <span
                key={i}
                className="inline-block h-36 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
