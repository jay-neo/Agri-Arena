import ArenaList from "./Arenas";
import type { Metadata } from "next";
import { getArenasWithParamsAction } from "~/app/actions/arena";
import { SearchBar } from "~/components/ui/SearchBar";
import { CreateArenaButton } from "~/components/ui/arena/CreateArenaButton";

// export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Arena",
};

export default async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || "";

  return (
    <>
      <div className="flex flex-row items-center justify-center mt-1 mb-4">
        <SearchBar
          placeholder="Search your arena here..."
          searchAction={getArenasWithParamsAction}
        />
        <CreateArenaButton />
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <ArenaList query={query} />
      </div>
    </>
  );
};
