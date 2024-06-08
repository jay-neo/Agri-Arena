import ArenaList from "./Arenas";
import type { Metadata } from "next";
import { ArenaSearchBar } from "~/components/ui/arena";
import { CreateArenaButton } from "~/components/ui/arena";

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
    <div className="pt-2 mb-28">
      <ArenaSearchBar placeholder="Search your arena here..." />
      <div className="flex flex-wrap items-center justify-center">
        <CreateArenaButton />
        <ArenaList query={query} />
      </div>
    </div>
  );
};
