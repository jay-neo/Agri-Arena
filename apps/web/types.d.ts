type Profile = {
  name: string;
  email: string;
  address: string;
  image: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

type UserProfile = {
  name: string;
  address: string;
  avatar: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
};

type Arenas = {
  idx: number;
  title: string;
  location: string;
  iots: number;
  updatedAt: Date;
};

type ArenaIds = {
  id: string;
  title: string;
  location: string;
};

type Arena = {
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

type IoTIds = {
  id: string;
  title: string;
  device: string;
};

type IoT_Details = {
  id: string;
  title: string;
  device: string;
  interval: number;
  location?: string;
  createdAt: Date;
  status?: string;
  arena?: string;
  arenaId?: string;
  arenaLocation?: string;
  description?: string;
};

type IoT = {
  id: string;
  title: string;
  device: string;
  interval: number;
  location?: string;
  description?: string;
  arena?: string;
  arenaId?: string;
  arenaLocation?: string;
};

type Experiments_Data = {
  id: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  moisture: number;
  ph: number;
  createdAt: Date;
};

type Activities = {
  idx: number;
  title: string;
  type: string;
  experimentsId?: string;
  imagesId?: string;
  predictionsId?: string;
  updatedAt: Date;
};

type Activity_Header = {
  title: string;
  arenaId?: string;
  arena?: string;
  arenaLocation?: string;
  type: string;
  iot?: string;
  device?: string;
  experimentsId?: string;
  predictionssId?: string;
  imagesId?: string;
};

type Events = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};
