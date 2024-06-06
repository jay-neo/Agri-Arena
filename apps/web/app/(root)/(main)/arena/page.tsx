import ArenaList from "./Arenas";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ArenaSearchBar } from "~/components/ui/arena";
import { CreateArenaButton } from "~/components/ui/arena";

export const dynamic = "force-static";

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
  const requestHeaders = headers();

  // Debug headers in the server console
  console.log("Request Headers in Server Action:", requestHeaders);

  const origin = requestHeaders.get("origin");
  const xForwardedHost = requestHeaders.get("x-forwarded-host");

  console.log("Origin:", origin);
  console.log("X-Forwarded-Host:", xForwardedHost);

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
