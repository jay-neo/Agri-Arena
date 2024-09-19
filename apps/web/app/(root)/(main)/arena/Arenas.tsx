import { myenv } from "~/lib/myenv";
import { getArenas } from "~/app/server/arena/getArenas";
import { ArenaPreview } from "./ArenaPreview";
import { getFakeArenas } from "~/test/data/faker";

export default async ({ query }: { query?: string }) => {
  const arenas: Arenas[] =
    myenv == "test" ? getFakeArenas() : await getArenas(query);

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(arenas);

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
