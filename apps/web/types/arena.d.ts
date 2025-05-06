type ArenaOverview = {
    idx: number;
    title: string;
    location: string;
    iots: number;
    updatedAt: Date;
};

type ArenaInfo = {
    id: string;
    title: string;
    location: string;
};

type ArenaDetails = {
    id: string;
    title: string;
    image: string;
    location: string;
    description?: string;
    createdAt: Date;
};

type ArenaDataCount = {
    experiments: number;
    predictions: number;
    images: number;
};