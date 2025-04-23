"use client";

import { getArenasWithParams } from "~/app/server/arena";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  async function handleSearch(term: string) {
    // const query = useDebounce(term, 300);
    const query = term;

    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
      await getArenasWithParams();
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("search") as string;
    handleSearch(searchTerm);
  }

  return (
      <form
        className="flex items-center justify-center my-auto w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-orange-300"
            >
              <path
                d="M7.85367 1.48956C7.65841 1.29429 7.34182 1.29429 7.14656 1.48956L1.48971 7.14641C1.29445 7.34167 1.29445 7.65825 1.48971 7.85352L7.14656 13.5104C7.34182 13.7056 7.65841 13.7056 7.85367 13.5104L13.5105 7.85352C13.7058 7.65825 13.7058 7.34167 13.5105 7.14641L7.85367 1.48956ZM7.5 2.55033L2.55037 7.49996L7.5 12.4496V2.55033Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            className="bg-gray-50  text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-3  dark:bg-white/5 dark:placeholder-gray-400 dark:text-white focus:outline-none"
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>
      </form>
  );
};
