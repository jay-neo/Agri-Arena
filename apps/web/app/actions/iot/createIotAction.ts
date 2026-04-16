"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";
import { IoTSchema, IoTState } from "./iot.schema";
import { formatDateToDDMMYYYY } from "~/lib/formatters";

export const createIotAction = async (
  _state: IoTState,
  formData: FormData,
): Promise<IoTState> => {
  const validatedFields = IoTSchema.safeParse({
    title: formData.get("title"),
    device: formData.get("device"),
    interval: Number(formData.get("interval")),
    location: formData.get("location"),
    description: formData.get("description"),
    arenaId: formData.get("arenaId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { id } = await getUser();
    const existedIot = await db.ioT.findUnique({
      where: {
        device: validatedFields.data.device,
      },
    });

    if (existedIot) {
      return {
        errors: {
          device: ["This device is already assigned."] as string[],
        },
      };
    }

    const iot = await db.ioT.create({
      data: {
        userId: id,
        title: validatedFields.data.title,
        interval: validatedFields.data.interval,
        device: validatedFields.data.device,
        location: validatedFields.data?.location,
        description: validatedFields.data?.description,
        status: validatedFields.data?.arenaId ? "active" : "inactive",
        arenaId: validatedFields.data?.arenaId || undefined,
      },
      select: {
        id: true,
        title: true,
        device: true,
        location: true,
        interval: true,
        createdAt: true,
        status: true,
        description: true,
        arena: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
      },
    });

    if (!iot) {
      return {
        error: "Oops! Something went wrong.",
      };
    }

    revalidatePath(`/my/iot`);

    return {
      success: "IoT created successfully.",
      code: JSON.stringify({
        id: iot.id,

        title: iot.title,
        device: iot.device,
        interval: iot.interval,

        location: iot?.location,
        description: iot?.description,

        arena: iot.arena?.title || undefined,
        arenaId: iot.arena?.id || undefined,
        arenaLocation: iot.arena?.location || undefined,

        status: iot.status,
        createdAt: formatDateToDDMMYYYY(iot.createdAt),
      }),
    };
  } catch (error) {
    console.log("Error creating IoT:", error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
