import {
  ImagesPage,
  getActivity,
  PredictionsPage,
  ExperimentsPage,
} from "~/app/server/activity";
import Header from "./Header";
import { myenv } from "~/lib/myenv";
import type { Metadata } from "next";
import { isNumber } from "~/lib/utils";
import { redirect } from "next/navigation";
import { getFakeActivity } from "~/test/data/faker";

export const metadata: Metadata = {
  title: "Activity",
};

export default async ({ params }: { params: { id: string } }) => {
  if (!isNumber(params.id)) {
    redirect(`/my/activity`);
  }

  const idx = Number(params.id);

  const data: Activity_Header =
    myenv === "test" ? getFakeActivity() : await getActivity(idx);

  if (!data) {
    redirect(`/my/activity`);
  }

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <div className="mt-2 md:mx-12">
      <Header data={data} idx={Number(params.id)} />
      <div className="mt-2">
        {data.type === "experiments" ? (
          <ExperimentsPage
            experimentsId={data?.experimentsId}
            isPredicted={data?.isPredicted}
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
