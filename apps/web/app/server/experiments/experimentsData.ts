"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/lib/prisma";
import { deleteActivity } from "../activity";
import { deleteExperiments } from "./experiments";
import { ExperimentFormSchema, ExperimentFormState } from "./validation";

///////////////////////////////////// GETTER ///////////////////////////////////
export const getExperimentsData = async (id: string) => {
  try {
    return await db.experiments_Data.findMany({
      where: {
        experimentsId: id,
      },
    });
  } catch (error) {
    return null;
  }
};

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteExperimentsData = async (
  state: ExperimentFormState,
  formData: FormData
): Promise<ExperimentFormState> => {
  try {
    const validatedFields = ExperimentFormSchema.safeParse(
      formData.getAll("experiment")
    );

    if (!validatedFields.success) {
      return {
        error: "Error! We couldn't process your request.",
      };
    } else if (validatedFields.data.length <= 0) {
      return {
        message: "Oops! Something went wrong",
      };
    }

    const data = validatedFields.data;

    const experiments = await db.experiments_Data.findUnique({
      where: {
        id: data[0],
      },
      select: {
        experimentsId: true,
      },
    });

    const activity = await db.activity.findUnique({
      where: {
        experimentsId: experiments.experimentsId,
      },
      select: {
        idx: true,
      },
    });

    const totalData: number = data.length;
    let deletedExperments = 0;

    data.forEach(async (id) => {
      deletedExperments++;
      await db.experiments_Data.delete({
        where: {
          id: id,
        },
      });
    });

    const updatedExperiments = await db.experiments.update({
      where: {
        id: experiments.experimentsId,
      },
      data: {
        count: {
          decrement: totalData,
        },
      },
      select: {
        count: true,
      },
    });

    if (updatedExperiments.count === 0) {
      await deleteExperiments(experiments.experimentsId, activity.idx);
      return {
        redirect: true,
        success: "All experiments successfully deleted.",
      };
    } else {
      revalidatePath(`/activiy/${activity.idx}`);
      return deletedExperments === 1
        ? {
            success: `Only ${deletedExperments} experiment deleted.`,
          }
        : {
            success: `Total ${deletedExperments} experiments deleted.`,
          };
    }
  } catch (error) {
    // console.log(error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
