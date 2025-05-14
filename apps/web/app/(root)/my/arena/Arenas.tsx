import { myenv } from "~/lib/myenv";
import { ArenaPreview } from "./ArenaPreview";
import { getFakeArenas } from "~/test/data/faker";
import { getAllArena } from "~/app/actions/arena";

export default async ({ query }: { query?: string }) => {
  const arenas: ArenaOverview[] =
    myenv == "test" ? getFakeArenas() : await getAllArena(query);

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <>
      {arenas ? (
        arenas.map((arena) => <ArenaPreview key={arena.idx} arena={arena} />)
      ) : (
        <></>
      )}
    </>
  );
};
