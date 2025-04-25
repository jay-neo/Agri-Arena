"use server";

export const getDiseaseDetectionModelsInfo = async (): Promise<DiseaseDetectionModelInfo[]> => {
    return (
        [
            {
                id: "1",
                name: "plant-disease-detection",
                description: "Plant Leaf Disease Detection",
                crop: "Rice",
                displayCrop: "Rice Leaf",
            },
            {
                id: "2",
                name: "plant-leaf-disease-detection",
                description: "Plant Leaf Disease Detection",
                crop: "Potato",
                displayCrop: "Potato Leaf",
            },
        ]
    )
}