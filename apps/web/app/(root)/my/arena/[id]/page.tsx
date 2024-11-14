import { myenv } from "~/lib/myenv";
import type { Metadata } from "next";
import { isNumber } from "~/lib/utils";
import ArenaDetails from "./ArenaDetails";
import { redirect } from "next/navigation";
import { getAssignedIoTs } from "~/app/server/iot";
import { getArena, getArenaDataCount } from "~/app/server/arena";
import { fakeAssignedIoTs, getFakeArenaDetails } from "~/test/data/faker";

export const metadata: Metadata = {
  title: "Arena",
};

export default async ({ params }: { params: { id: string } }) => {
  if (!isNumber(params.id)) {
    redirect(`/my/arena`);
  }
  const arenaIdx = parseFloat(params.id);

  const arena: Arena =
    myenv === "test"
      ? await getFakeArenaDetails(arenaIdx)
      : await getArena(arenaIdx);

  if (!arena) {
    redirect(`/my/arena`);
  }

  const assignedIoTsData: IoTIds[] =
    myenv === "test" ? fakeAssignedIoTs : await getAssignedIoTs(arena.id);

  const arenaDataCount: ArenaDataCount =
    myenv === "test"
      ? {
          experiments: 1,
          predictions: 1,
          images: 1,
        }
      : await getArenaDataCount(arena.id);

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <div className="max-w-4xl mx-auto p-1">
      <ArenaDetails
        arenaIdx={arenaIdx}
        arenaData={arena}
        assignedIoTsData={assignedIoTsData}
        arenaDataCount={arenaDataCount}
      />
    </div>
  );
};
