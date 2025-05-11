"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getActivitiesWithParams } from "~/app/actions/activity/getActivitiesWithParamsAction";

export default () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = async (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await getActivitiesWithParams();
  };

  return (
    <>
      <div className="flex-shrink-0 inline-flex items-center pl-4 pr-2 text-sm font-medium text-center text-gray-900  bg-gray-100 rounded-l-3xl dark:bg-gray-700 border-l border-b border-t dark:border-gray-600 border-gray-300 dark:text-white">
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search Bar</span>
      </div>

      <div className="relative w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="search"
          id="search-dropdown"
          className="focus-visible:outline-none focus-visible:ring-0 block p-2.5 w-full truncate z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300  dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Search your activities "
          autoComplete="off"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
    </>
  );
};
