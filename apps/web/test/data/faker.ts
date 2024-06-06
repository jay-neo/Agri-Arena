import { faker } from "@faker-js/faker";
import { defaultArenaAvatar } from "~/lib/constants";

const generateFakeArenas = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: faker.string.uuid(),
    idx: index + 1,
    iots: index + 1,
    title: faker.animal.bird(),
    location: faker.location.streetAddress(),
    description: faker.string.uuid(),
    updatedAt: faker.date.recent(),
    createdAt: faker.date.recent(),
  }));
};

const generateFakeIoTs = (count: number): IoTIds[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    device: faker.string.uuid(),
  }));
};

function generateFakeActivities(num: number) {
  const activities = [];
  for (let i = 0; i < num; i++) {
    const activity = {
      title: faker.person.firstName(),
      id: faker.string.uuid(),
      idx: i + 1,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      type: faker.helpers.arrayElement([
        // "images",
        // "predictions",
        "experiments",
      ]),
      experimentsId: faker.string.uuid(),
      imagesId: faker.string.uuid(),
      predictionsId: faker.string.uuid(),
    };
    activities.push(activity);
  }
  return activities;
}

function generateFakeIoTData(num: number = 20) {
  const iotDataArray = [];

  for (let i = 0; i < num; i++) {
    const iotData = {
      id: faker.string.uuid(),
      createdAt: faker.date.past({ years: 1 }),
      nitrogen: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
      phosphorus: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
      potassium: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
      ph: faker.number.float({ min: 0, max: 14, multipleOf: 0.01 }),
      moisture: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
      temperature: faker.number.float({ min: -10, max: 100, multipleOf: 0.01 }),
      humidity: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
    };
    //
    iotDataArray.push(iotData);
  }

  iotDataArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return iotDataArray;
}

function generateFakeIPData(num: number) {
  const ipDataArray = [];
  for (let i = 0; i < num; i++) {
    const ipData = {
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      image: faker.image.url(),
      userId: faker.string.uuid(),
      arenaId: faker.string.uuid(),
    };
    ipDataArray.push(ipData);
  }
  return ipDataArray;
}

const staticFakeArenas = generateFakeArenas(12);
const staticFakeAvailableIoTs = generateFakeIoTs(20);
const staticFakeAssignedIoTs = generateFakeIoTs(5);
const staticFakeActivities = generateFakeActivities(10);
const staticFakeIoTData = generateFakeIoTData(30);
const staticFakeIpData = generateFakeIPData(10);

export const fakeAvailableIoTs = staticFakeAvailableIoTs;
export const fakeAssignedIoTs = staticFakeAssignedIoTs;

export const getFakeArenas = () => {
  return staticFakeArenas.map((arena) => ({
    idx: arena.idx,
    title: arena.title,
    iots: arena.iots,
    location: arena.location,
    updatedAt: arena.updatedAt,
  }));
};

export const getFakeArenaDetails = async (arenaId: number) => {
  const arena = staticFakeArenas.find((arena) => arena.idx === arenaId);
  return {
    id: arena.id,
    title: arena.title,
    image: defaultArenaAvatar,
    location: arena.location,
    description: arena.description,
    createdAt: arena.createdAt,
  };
};

export const getFakeActivity = () => {
  return staticFakeActivities[0];
};

export const getFakeActivities = () => {
  return staticFakeActivities.map((act) => ({
    title: act.title,
    idx: act.idx,
    type: act.type,
    experimentsId: act.ipDataId,
    imagesId: act.iotDataId,
    predictionsId: act.mlDataId,
    updatedAt: act.updatedAt,
  }));
};

export const getFakeIotData: any = async (idx?: number) => {
  return idx ? staticFakeIoTData[idx] : staticFakeIoTData;
};

export const getFakeIpData: any = async (idx?: number) => {
  return idx ? staticFakeIpData[idx] : staticFakeIpData;
};

export const getFakeIotDataOneYear: any = async () => {
  const monthlyData: { [key: string]: any } = {};

  staticFakeIoTData.forEach((d) => {
    const month = d.createdAt.toLocaleString("default", { month: "short" });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        temperatureSum: 0,
        humiditySum: 0,
        moistureSum: 0,
        phSum: 0,
        nSum: 0,
        pSum: 0,
        kSum: 0,
        count: 0,
      };
    }

    monthlyData[month].temperatureSum += d.temperature;
    monthlyData[month].humiditySum += d.humidity;
    monthlyData[month].moistureSum += d.moisture;
    monthlyData[month].phSum += d.ph;
    monthlyData[month].nSum += d.nitrogen;
    monthlyData[month].pSum += d.phosphorus;
    monthlyData[month].kSum += d.potassium;
    monthlyData[month].count += 1;
  });

  const dataset = Object.keys(monthlyData).map((month) => ({
    month,
    temperature: monthlyData[month].temperatureSum / monthlyData[month].count,
    humidity: monthlyData[month].humiditySum / monthlyData[month].count,
    moisture: monthlyData[month].moistureSum / monthlyData[month].count,
    ph: monthlyData[month].phSum / monthlyData[month].count,
    nitrogen: monthlyData[month].nSum / monthlyData[month].count,
    phosphorus: monthlyData[month].pSum / monthlyData[month].count,
    potassium: monthlyData[month].kSum / monthlyData[month].count,
  }));

  return dataset;
};

export const getFakeIotDataFiveYears: any = async () => {
  const monthlyData: { [key: string]: any } = {};

  staticFakeIoTData.forEach((d) => {
    const month = monthlyData.createdAt.toLocaleString("default", {
      month: "short",
    });
    const year = monthlyData.createdAt.getFullYear();
    const key = `${month}-${year}`;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        temperatureSum: 0,
        humiditySum: 0,
        moistureSum: 0,
        phSum: 0,
        nSum: 0,
        pSum: 0,
        kSum: 0,
        count: 0,
        year,
        month,
      };
    }

    monthlyData[month].temperatureSum += d.temperature;
    monthlyData[month].humiditySum += d.humidity;
    monthlyData[month].moistureSum += d.moisture;
    monthlyData[month].phSum += d.ph;
    monthlyData[month].nSum += d.nitrogen;
    monthlyData[month].pSum += d.phosphorus;
    monthlyData[month].kSum += d.potassium;
    monthlyData[month].count += 1;
  });

  const dataset = Object.keys(monthlyData).map((month) => ({
    month: monthlyData[month].month,
    year: monthlyData[month].year,
    temperature: monthlyData[month].temperatureSum / monthlyData[month].count,
    humidity: monthlyData[month].humiditySum / monthlyData[month].count,
    moisture: monthlyData[month].moistureSum / monthlyData[month].count,
    ph: monthlyData[month].phSum / monthlyData[month].count,
    nitrogen: monthlyData[month].nSum / monthlyData[month].count,
    phosphorus: monthlyData[month].pSum / monthlyData[month].count,
    potassium: monthlyData[month].kSum / monthlyData[month].count,
  }));

  return dataset;
};

export const getFakeIoTDetails = (num = 20): IoT_Details[] => {
  return Array.from({ length: num }, (_, index) => ({
    id: faker.string.uuid(),
    title: faker.animal.bird(),
    device: faker.number.bigInt().toString(),
    interval: faker.number.int({ min: 1, max: 30 }),
    location: faker.location.streetAddress(),
    createdAt: faker.date.recent(),
    status: faker.helpers.arrayElement(["active", "inactive", "maintenance"]),
    arena: faker.company.name(),
    arenaLocation: faker.location.country(),
    description: faker.lorem.sentence(),
  }));
};
