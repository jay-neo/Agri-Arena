import { getActivity } from "~/app/actions/activity";
import Link from "next/link";
import Image from "next/image";
import { HOMEPAGE } from "~/lib/routes";
import { redirect } from "next/navigation";
import { findShare } from "~/app/actions/share";
import { getUserById } from "~/app/actions/user";
import { ExperimentsPage } from "~/app/(root)/my/activity/[id]/ExperimentsPage";
import { PredictionsPage } from "~/app/(root)/my/activity/[id]/PredictionsPage";
import { ImagesPage } from "~/app/(root)/my/activity/[id]/ImagesPage";

export default async ({ params }: { params: { id: string } }) => {
  const share = await findShare(params.id);
  if (!share?.userId) {
    return redirect(HOMEPAGE);
  }

  const user = await getUserById(share.userId);
  const data: ActivityHeader = await getActivity(share.idx, share.userId);

  if (!data) {
    return redirect(HOMEPAGE);
  }

  return (
    <div className="mt-2 md:mx-12">
      <div className="mb-2">
        <div className="relative">
          <h2 className="text-2xl text-center font-bold mb-1">{data.title}</h2>
          {data?.arena && (
            <h3 className="text-lg text-center mb-1">Arena: {data?.arena}</h3>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={user?.image}
            alt="user"
            width={200}
            height={200}
            className="w-10 h-10 rounded-full"
          />
          <Link
            href={`/social/user/${user?.profile?.username}`}
            className="font-bold text-green-500 hover:underline dark:text-yellow-400"
          >
            {user?.name}
          </Link>
        </div>
      </div>

      <div className="mt-2">
        {data.type === "experiments" ? (
          <ExperimentsPage
            experimentsId={data?.experimentsId}
            isPredicted={data?.isPredicted}
            share={true}
          />
        ) : data.type === "predictions" ? (
          <PredictionsPage
            predictionsId={data?.predictionsId}
            experimentsId={data?.experimentsId}
          />
        ) : (
          data.type === "images" && <ImagesPage imagesId={data?.imagesId} />
        )}
      </div>
    </div>
  );
};
