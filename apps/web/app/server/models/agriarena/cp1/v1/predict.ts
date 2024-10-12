"use server";

import { cp1v1ModelEndpoint } from "~/lib/myenv";

export const predict = async (
  data: Experiments_Data_T1V1[]
): Promise<Model_Response_V1 | null> => {
  try {
    // const response = await fetch(cp1v1ModelEndpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     data: data,
    //   }),
    // });

    // if (!response.ok) {
    //   return null;
    // }

    // const result = await response.json();

    // return {
    //   name: "agriarena.model.cp1v1",
    //   number: (result?.number as number) || 1,
    //   result: (result?.result as string[]) || ["Rice"],
    //   accuracy: (result?.accuracy as string[]) || ["70"],
    // } as Model_Response_T1V1;

    return {
      name: "agriarena.model.cp1v1",
      number: 4,
      result: ["Rice", "Banana", "Potato", "Carrot"],
      accuracy: ["70", "20.2", "12", "5"],
    } as Model_Response_V1;
  } catch (error) {
    return null;
  }
};
