"use server";

import { db } from "~/lib/prisma";
import { predict } from "./predict";
import { prompting } from "./prompting";
import { getUser } from "~/app/server/user";
import { createActivity } from "~/app/server/activity";
import { revalidatePath } from "next/cache";

export const cropPredict = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getUser();
    const idx = formData.get("idx");
    const experimentsId = formData.get("experimentsId") as string;
    const arenaId = (formData?.get("arenaId") as string) || null;

    const data: Experiments_Data_T1V1[] = await db.experiments_Data.findMany({
      where: {
        experimentsId: experimentsId,
      },
    });
    if (!data) {
      return {
        error: "Oops! No experiments found.",
      };
    }

    const res: Model_Response_V1 = await predict(data);
    if (!res) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const promptResponse: string[] = await prompting(res);
    if (!promptResponse) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    // Save the all response
    const predictions = await db.predictions.create({
      data: {
        userId: user.id,
        experimentsId: experimentsId,
        arenaId: arenaId,
      },
      select: {
        id: true,
      },
    });
    if (!predictions) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const savedResult = await db.model_v1.create({
      data: {
        name: res?.name || null,
        number: res?.number || null,
        result: res?.result || null,
        accuracy: res?.accuracy || null,
      },
      select: {
        id: true,
      },
    });
    const savedResultData = await db.predictions_Data.create({
      data: {
        role: "model",
        predictionsId: predictions.id,
        modelResponseId: savedResult.id,
      },
      select: {
        id: true,
      },
    });
    if (!savedResult || !savedResultData) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const savedPrompting = await db.predictions_Data.create({
      data: {
        predictionsId: predictions.id,
        role: "ai",
        text: promptResponse,
      },
      select: {
        id: true,
      },
    });
    if (!savedPrompting) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const updatedExperiment = await db.experiments.update({
      where: {
        id: experimentsId,
      },
      data: {
        isPredicted: true,
      },
    });
    if (!updatedExperiment) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    const activity = await createActivity(
      user.id,
      "predictions",
      predictions.id
    );
    if (!activity) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    revalidatePath(`/my/activity/${idx}`);
    return {
      success: "Successfully predict crops for your arena.",
      next: `/my/activity/${activity}`,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
