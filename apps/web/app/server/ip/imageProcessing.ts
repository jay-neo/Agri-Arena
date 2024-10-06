import { db } from "~/lib/prisma";

export const imageProcessing = async (
  imagesId: string,
  groupId: number
): Promise<boolean> => {
  try {
    // Image Processing API Call

    const response = {
      code: 5,
      response: "Bacterial canker",
    };

    await db.images_Data.create({
      data: {
        imagesId: imagesId,
        groupId: groupId,
        type: "processingResponse",
        processingCode: response.code,
        processingResponse: response.response,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};
