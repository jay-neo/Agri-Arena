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

      {data.type === "experiments" ? (
        <Experiments dataId={data.experimentsId} />
      ) : data.type === "predictions" ? (
        <Predictions dataId={data.predictionssId} />
      ) : (
        data.type === "images" && <Images dataId={data.imagesId} />
      )}
    </div>
  );
};
