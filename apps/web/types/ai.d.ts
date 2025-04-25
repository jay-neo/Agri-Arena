type CropPredictionModelRequest = {
    experimentsData: ExperimentsData[]
};

type CropPredictionModelResponse = {
    name: string;
    number: number;
    result: string[];
    accuracy: string[];
};

type DiseaseDetectionModelRequest = {
    modelId: string;
    imageUrl: string;
};

type DiseaseDetectionModelResponse = {
    name: string;
    number: number;
    result: string[];
    accuracy: string[];
};

type DiseaseDetectionModelInfo = {
    id: string;
    name: string;
    description?: string;
    crop: string;
    displayCrop: string;
}
