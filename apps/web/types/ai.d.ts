type CropPredictionModelRequest = {
    experimentsData: ExperimentsData[]
};

type CropPredictionModelResponse = {
    number_of_crops?: number;
    prediction: string[];
    confidence: number[];
};

type DiseaseDetectionModelRequest = {
    modelId?: string;
    arenaId?: string;
    crop?: string;
    imageUrl?: string;
    modelCetegory?: string;
};

type DiseaseDetectionModelResponse = {
    number_of_disease: number;
    result: string[];
    possibility: number[];
};

type DiseaseDetectionModelInfo = {
    id: string;
    cetegory: string;
    description?: string;
    crop: string;
    displayCrop: string;
}
