import { myenv } from "~/lib/myenv";
import { getFakeActivity } from "~/test/data/faker";
import { getActivity } from "~/app/server/activity";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isNumber } from "~/lib/utils/checker";

import Header from "./Header";
import Images from "./Images";
import Predictions from "./Predictions";
import Experiments from "./Experiments";

export const metadata: Metadata = {
  title: "Activity",
};

export default async ({ params }: { params: { id: string } }) => {
  if (!isNumber(params.id)) {
    redirect(`/activity`);
  }

  const idx = Number(params.id);

  const data: Activity_Header =
    myenv === "test" ? getFakeActivity() : await getActivity(idx);

  if (!data) {
    redirect(`/activity`);
  }

  // await new Promise((resolve) => setTimeout(resolve, 7000));

  return (
    <div className="mt-2 md:mx-12">
      <Header data={data} idx={Number(params.id)} />
      <div className="mt-2">
        {data.type === "experiments" ? (
          <Experiments
            experimentsId={data?.experimentsId}
            isNotPredicted={!data?.isPredicted}
          />
        ) : data.type === "predictions" ? (
          <Predictions
            predictionsId={data?.predictionsId}
            experimentsId={data?.experimentsId}
          />
        ) : (
          data.type === "images" && <Images imagesId={data?.imagesId} />
        )}
      </div>
    </div>
  );
};
