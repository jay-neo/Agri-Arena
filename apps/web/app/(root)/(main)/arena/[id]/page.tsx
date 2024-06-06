import { myenv } from "~/lib/myenv";
import type { Metadata } from "next";
import ArenaDetails from "./ArenaDetails";
import { redirect } from "next/navigation";
import { getArena } from "~/app/server/arena";
import { isNumber } from "~/lib/utils/checker";
import { getAssignedIoTs } from "~/app/server/iot";
import { fakeAssignedIoTs, getFakeArenaDetails } from "~/test/data/faker";
import { getArenaDataCount } from "~/app/server/arena/getArenaDataCount";

export const metadata: Metadata = {
  title: "Arena",
};

export default async ({ params }: { params: { id: string } }) => {
  if (!isNumber(params.id)) {
    redirect(`/arena`);
  }
  const arenaIdx = parseFloat(params.id);

  const arena: Arena =
    myenv === "test"
      ? await getFakeArenaDetails(arenaIdx)
      : await getArena(arenaIdx);

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
