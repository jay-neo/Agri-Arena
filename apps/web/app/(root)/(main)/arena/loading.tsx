export default function () {
    return (
      <>
        <div className="contrainer max-w-4xl mx-auto p-1">
          <div className="flex flex-wrap items-center justify-center">
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {[...Array(10).keys()].map((i) => (
                <div key={i}>
                  <span
                    className="inline-block h-40 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      animationDuration: "1s",
                    }}
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
  