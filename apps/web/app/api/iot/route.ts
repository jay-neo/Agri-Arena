import { db } from "~/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createActivity, updateMonitor } from "~/app/server/activity";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data?.device) {
      return NextResponse.json({
        error: "Device identifier not found!",
        status: 500,
      });
    }

    const device = await db.ioT.findUnique({
      where: { device: data.device },
      select: {
        title: true,
        device: true,
        userId: true,
        arenaId: true,
        interval: true,
        experimentsId: true,
      },
    });

    if (!device || !device?.arenaId) {
      return NextResponse.json({
        error: "Device not registered!",
        status: 404,
      });
    }

    let isNewActivity: boolean = true;
    let experiment: { experimentId: string; activityIdx: number } = {
      experimentId: null,
      activityIdx: null,
    };

    if (!device?.experimentsId) {
      // console.log("Logic - 1");
      experiment = await createExperiment(
        device.userId,
        device.device,
        device.title,
        device?.arenaId,
        "Innovation Unleashed"
      );
    } else {
      const existedExperiments = await db.experiments.findUnique({
        where: {
          id: device.experimentsId,
        },
        select: {
          id: true,
          createdAt: true,
          arenaId: true,
        },
      });

      if (!existedExperiments) {
        // console.log("Logic - 2");
        experiment = await createExperiment(
          device.userId,
          device.device,
          device.title,
          device?.arenaId,
          "Frontline Discoveries"
        );
      } else if (
        isValidExperimentInterval(existedExperiments.createdAt, device.interval)
      ) {
        // console.log("Logic - 3");
        experiment = await createExperiment(
          device.userId,
          device.device,
          device.title,
          device?.arenaId,
          "Experiment Chronicles"
        );
      } else if (
        device?.arenaId &&
        device.arenaId !== existedExperiments.arenaId
      ) {
        // console.log("Logic - 4");
        experiment = await createExperiment(
          device.userId,
          device.device,
          device.title,
          device?.arenaId,
          "Groundbreaking Experiments"
        );
      } else {
        // console.log("Logic - 5");
        await db.experiments.update({
          where: {
            id: existedExperiments.id,
          },
          data: {
            count: {
              increment: 1,
            },
          },
        });
        const monitor = await updateMonitor(device.userId, "experiments");
        experiment = {
          experimentId: existedExperiments.id,
          activityIdx: monitor.activities,
        };
        isNewActivity = false;
      }
    }

    await db.ioT.update({
      where: {
        device: device.device,
      },
      data: {
        experimentsId: experiment.experimentId,
      },
    });

    const insertedData = await db.experiments_Data.create({
      data: {
        createdAt: data.timestamp,
        ph: parseFloat(data.ph),
        ipAddress: String(data.ip),
        nitrogen: parseFloat(data.nitrogen),
        humidity: parseFloat(data.humidity),
        moisture: parseFloat(data.moisture),
        potassium: parseFloat(data.potassium),
        phosphorus: parseFloat(data.phosphorus),
        temperature: parseFloat(data.temperature),
        experimentsId: experiment.experimentId,
      },
    });

    if (isNewActivity) {
      revalidatePath(`/activity`);
    }

    if (!isNewActivity && insertedData) {
      revalidatePath(`/activity/${experiment.activityIdx}`);
    }

    return NextResponse.json({
      message: "Successfully accepted!",
      status: 200,
    });
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Error occurred!", status: 500 });
  }
}

function isValidExperimentInterval(
  targetDate: Date,
  intervalInDays: number
): boolean {
  const now = new Date();
  const differenceInMs = targetDate.getTime() - now.getTime();
  const intervalInMs = intervalInDays * 24 * 60 * 60 * 1000;
  return differenceInMs > intervalInMs ? true : false;
}

const createExperiment = async (
  userId: string,
  device: string,
  deviceTitle: string,
  arenaId?: string,
  activityTitle?: string
) => {
  try {
    const experiment = await db.experiments.create({
      data: {
        userId: userId,
        device: device,
        iotTitle: deviceTitle,
        arenaId: arenaId || null,
      },
      select: {
        id: true,
      },
    });

    const activity: number = await createActivity(
      userId,
      "experiments",
      experiment.id,
      activityTitle
    );

    if (experiment && activity) {
      return {
        experimentId: experiment.id,
        activityIdx: activity,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
