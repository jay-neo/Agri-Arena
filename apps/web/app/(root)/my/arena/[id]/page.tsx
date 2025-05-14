import type { Metadata } from "next";
import { isNumber } from "~/lib/utils";
import ArenaDetails from "./ArenaDetails";
import { redirect } from "next/navigation";
import { getAssignedIotsForArena } from "~/app/actions/iot";
import { getArena, getArenaDataCount } from "~/app/actions/arena";

export const metadata: Metadata = {
  title: "Arena",
};

export default async ({ params }: { params: { id: string } }) => {
  if (!isNumber(params.id)) {
    redirect(`/my/arena`);
  }
  const arenaIdx = parseFloat(params.id);

  const arena: ArenaDetails = await getArena(arenaIdx);

  if (!arena) {
    redirect(`/my/arena`);
  }

  const assignedIoTsData: IotInfo[] = await getAssignedIotsForArena(arena.id);
  const arenaDataCount: ArenaSpecificActivity = await getArenaDataCount(
    arena.id,
  );

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <div className="max-w-4xl mx-auto p-1">
      <ArenaDetails
        arenaIdx={arenaIdx}
        arenaData={arena}
        assignedIoTsData={assignedIoTsData}
        arenaSpecificActivity={arenaDataCount}
      />
    </div>
  );
};
