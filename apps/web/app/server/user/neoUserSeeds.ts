import { db } from "~/lib/prisma";
import { faker } from "@faker-js/faker";
import { getRandomString } from "~/lib/utils";
import { defaultArenaAvatar, defaultArenaAvatars } from "~/lib/constants";

export const neoUserSeeds = async (userId: string): Promise<boolean> => {
  try {
    const arena = await db.arena.create({
      data: {
        idx: 0,
        userId: userId,
        image: getRandomString(defaultArenaAvatars) || defaultArenaAvatar,
        title: "Demo Arena",
        location: "Virtual",
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
      },
      select: {
        id: true,
      },
    });
    for (let i = 0; i < 10; ++i) {
      await db.experiments_Data.create({
        data: {
          createdAt: faker.date.recent(),
          nitrogen: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
          phosphorus: faker.number.float({
            min: 0,
            max: 100,
            multipleOf: 0.01,
          }),
          potassium: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
          ph: faker.number.float({ min: 0, max: 14, multipleOf: 0.01 }),
          moisture: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
          temperature: faker.number.float({
            min: -10,
            max: 100,
            multipleOf: 0.01,
          }),
          humidity: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
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
