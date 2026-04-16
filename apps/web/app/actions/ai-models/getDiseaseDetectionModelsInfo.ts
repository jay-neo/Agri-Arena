"use server";

export const getDiseaseDetectionModelsInfo = async (): Promise<
  DiseaseDetectionModelInfo[]
> => {
  return [
    {
      id: "1",
      crop: "Rice",
      displayCrop: "Rice Leaf",
      cetegory: "agriarena_dd1v1",
      description: "Plant Leaf Disease Detection",
    },
    {
      id: "2",
      crop: "Potato",
      displayCrop: "Potato Leaf",
      cetegory: "agriarena_dd1v1",
      description: "Plant Leaf Disease Detection",
    },
    {
      id: "3",
      crop: "Tomato",
      displayCrop: "Tomato Leaf",
      cetegory: "agriarena_dd1v1",
      description: "Plant Leaf Disease Detection",
    },
  ];
};
