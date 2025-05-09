type ArenaBaseData = {
  image?: string;
  title: string;
  location: string;
  area?: string;
  soilType?: string;
  currentCrop?: string;
  description?: string;
};

type ArenaOverview = ArenaBaseData & {
  idx: number;
  iots: number;
  updatedAt: Date;
};

type ArenaInfo = {
  id: string;
  title: string;
  location: string;
};

type ArenaDetails = ArenaBaseData & {
  id: string;
  idx: number;
  isReal: boolean;
  updatedAt: Date;
  createdAt: Date;
};

type ArenaSpecificActivity = {
  experiments: number;
  predictions: number;
  images: number;
};
