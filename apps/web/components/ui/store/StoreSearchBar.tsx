"use client";

import { getProductsWithParams } from "~/app/server/store";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
    await getProductsWithParams();
  };

  return (
    <>
      <form className="flex rounded-ss-2xl rounded-ee-2xl  min-w-2xl overflow-hidden max-w-md mx-auto font-[sans-serif]">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="search"
          id="search"
          name="search"
          placeholder="Search products on AgriArena store"
          autoComplete="off"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="focus-visible:outline-none focus-visible:ring-0 block p-2.5 w-full truncate text-sm text-gray-900 bg-gray-50  dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-[#007bff] px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-white"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </button>
      </form>
    </>
  );
};
