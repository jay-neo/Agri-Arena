import { ExperimentsPage } from "~/app/(root)/my/activity/[id]/ExperimentsPage";
import { ImagesPage } from "~/app/(root)/my/activity/[id]/ImagesPage";
import { PredictionsPage } from "~/app/(root)/my/activity/[id]/PredictionsPage";
import { getActivity } from "~/app/actions/activity";
import { findShare } from "~/app/actions/share";

export default async ({ params }: { params: { id: string } }) => {
  const share = await findShare(params.id);
  const data: ActivityHeader = await getActivity(share.idx, share.userId);

  if (!data) {
  }

  return (
    <div className="mt-2 md:mx-12">
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
