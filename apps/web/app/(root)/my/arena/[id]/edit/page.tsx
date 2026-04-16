import { isNumber } from "~/lib/utils";
import { redirect } from "next/navigation";
import { getArena } from "~/app/actions/arena";
import { EditArenaForm } from "./EditArenaForm";

export default async function Page({ params }: { params: { id: string } }) {
  if (!isNumber(params.id)) {
    redirect(`/my/arena`);
  }
  const arenaIdx = parseFloat(params.id);

  const arena: ArenaDetails = await getArena(arenaIdx);

  if (!arena) {
    redirect(`/my/arena/${arenaIdx}`);
  }

  return <EditArenaForm arena={arena} />;
}
