import { dd1v1ModelEndpoint } from "~/lib/myenv";

export const processing = async (
  image: string
): Promise<Model_Response_V1 | null> => {
  try {
    // const response = await fetch(dd1v1ModelEndpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       url: image,
    //     },
    //   }),
    // });

    // if (!response.ok) {
    //   return null;
    // }

    // const result = await response.json();

    // return {
    //   name: "agriarena.model.dd1v1",
    //   number: (result?.number as number),
    //   result: (result?.result as string[]),
    //   accuracy: (result?.accuracy as string[]),
    // } as Model_Response_T1V1;

    // For Testing
    return {
      name: "agriarena.model.dd1v1",
      number: 4,
      result: ["Rice", "Banana", "Potato", "Carrot"],
      accuracy: ["70", "20.2", "12", "5"],
    } as Model_Response_V1;
  } catch (error) {
    return null;
  }
};
