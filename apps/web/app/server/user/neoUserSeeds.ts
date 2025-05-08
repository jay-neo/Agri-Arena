import { db } from "~/lib/prisma";
import { faker } from "@faker-js/faker";
import { getRandomString } from "~/lib/utils";
import { defaultArenaAvatar, defaultArenaAvatars } from "~/lib/constants";

const experimentData = [
  {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.8797,
    "humidity": 82.00,
    "ph": 6.5,
    "moisture": 75
  },
  {
    "N": 85,
    "P": 58,
    "K": 41,
    "temperature": 21,
    "humidity": 80,
    "ph": 7,
    "moisture": 80
  },
  {
    "N": 78,
    "P": 42,
    "K": 42,
    "temperature": 20.13,
    "humidity": 81.60,
    "ph": 7.6,
    "moisture": 80
  },
  {
    "N": 60,
    "P": 55,
    "K": 44,
    "temperature": 23.00,
    "humidity": 82.32,
    "ph": 7.8,
    "moisture": 90
  },
  {
    "N": 74,
    "P": 35,
    "K": 40,
    "temperature": 26.49,
    "humidity": 80.16,
    "ph": 6.98,
    "moisture": 85
  },
  {
    "N": 69,
    "P": 37,
    "K": 42,
    "temperature": 23.05,
    "humidity": 83.37,
    "ph": 7.07,
    "moisture": 82
  }
]


export const neoUserSeeds = async (userId: string): Promise<boolean> => {
  try {
    const arena = await db.arena.create({
      data: {
        idx: 0,
        userId: userId,
        image: getRandomString(defaultArenaAvatars) || defaultArenaAvatar,
        title: "Demo Arena",
        location: "Virtual",
        isReal: false,
        description: "This is auto-generated arena.",
      },
    });
    const iot = await db.ioT.create({
      data: {
        interval: 2,
        userId: userId,
        arenaId: arena.id,
        status: "virtual",
        title: "Demo IoT",
        location: "Virtual",
        description: "This is auto-generated IoT.",
      },
      select: {
        id: true,
        title: true,
        device: true,
      },
    });
    const experiments = await db.experiments.create({
      data: {
        count: 10,
        userId: userId,
        arenaId: arena.id,
        device: iot.device,
        iotTitle: iot.title,
      },
      select: {
        id: true,
      },
    });
    await db.activity.create({
      data: {
        idx: 0,
        userId: userId,
        type: "experiments",
        title: "Demo Activity",
        experimentsId: experiments.id,
        isReal: false,
      },
      select: {
        id: true,
      },
    });
    for (let i = 0; i < experimentData.length; ++i) {
      await db.experiments_Data.create({
        data: {
          createdAt: faker.date.recent(),
          nitrogen: experimentData[i].N,
          phosphorus: experimentData[i].P,
          potassium: experimentData[i].K,
          ph: experimentData[i].ph,
          moisture: experimentData[i].moisture,
          temperature: experimentData[i].temperature,
          humidity: experimentData[i].humidity,
          experimentsId: experiments.id,
        },
        select: {
          id: true,
        },
      });
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
