import Link from "next/link";

export default async ({
  arenaIdx,
  arenaDataCount,
}: {
  arenaIdx: number;
  arenaDataCount: ArenaDataCount;
}) => {
  return (
    <div className="mr-0.5">
      {arenaDataCount.experiments ? (
        <div className="flex flex-col items-end text-right mt-4 w-full space-y-1">
          <div className="font-bold mr-2">Experiments</div>
          <div className="max-w-2/3 flex justify-end pb-1">
            <Link href={`${arenaIdx}/experiments`}>
              <p
                className={`text-black text-sm text-center block ps-3 p-2.5 dark:text-white bg-inherit text-wrap w-64 rounded-3xl border-2 border-amber-800 hover:bg-amber-800 hover:text-white hover:font-bold`}
              >
                {"View Experiments"}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
      {arenaDataCount.predictions ? (
        <div className="flex flex-col items-end text-right mt-4 w-full space-y-1">
          <div className="font-bold mr-2">Predictions</div>
          <div className="max-w-2/3 flex justify-end pb-1">
            <Link href={`${arenaIdx}/predictions`}>
              <p
                className={`text-black text-sm text-center block ps-3 p-2.5 dark:text-white bg-inherit text-wrap w-80 rounded-3xl border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white hover:font-bold`}
              >
                {"View Predictions"}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
      {arenaDataCount.images ? (
        <div className="flex flex-col items-end text-right mt-4 w-full space-y-1">
          <div className="font-bold mr-2">Images</div>
          <div className="max-w-2/3 flex justify-end pb-1">
            <Link href={`${arenaIdx}/images`}>
              <p
                className={`text-black text-sm text-center block ps-3 p-2.5 dark:text-white bg-inherit text-wrap w-48 rounded-3xl border-2 border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white hover:font-bold`}
              >
                {"View Images"}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
