type Activity = {
  idx: string;
  title: string;
  type: "experiments" | "predictions" | "images";
  updatedAt: Date;
  experimentsId?: string;
  predictionsId?: string;
  imagesId?: string;
  arenaTitle?: string;
  arenaLocation?: string;
  arenaImage?: string;
};

type ActivityHeader = {
  title: string;
  arenaId?: string;
  arena?: string;
  arenaLocation?: string;
  type: string;
  iot?: string;
  device?: string;
  ref?: number;
  experimentsId?: string;
  isPredicted?: boolean;
  predictionsId?: string;
  imagesId?: string;
};
