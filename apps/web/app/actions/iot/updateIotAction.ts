"use server";

import { formatDateToDDMMYYYY } from "~/lib/formatters";
import { getUser } from "../user";
import { db } from "~/lib/prisma";
import { IoTSchema, IoTState } from "./iot.schema";

export const updateIotAction = async (
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
    const iot = await db.ioT.update({
      where: {
        userId: id,
        device: validatedFields.data.device,
      },
      data: {
        title: validatedFields.data.title,
        interval: validatedFields.data.interval,
        location: validatedFields.data?.location,
        description: validatedFields.data?.description,
        status: validatedFields.data?.arenaId ? "active" : "inactive",
        arenaId: validatedFields.data?.arenaId || null,
      },
      select: {
        id: true,
        title: true,
        device: true,
        location: true,
        interval: true,
        createdAt: true,
        description: true,
        status: true,
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

    return {
      success: "IoT updated successfully.",
      code: JSON.stringify({
        id: iot.id,

        title: iot.title,
        device: iot.device,
        interval: iot.interval,

        location: iot?.location,
        description: iot?.description,

        arena: iot.arena?.title || null,
        arenaId: iot.arena?.id || null,
        arenaLocation: iot.arena?.location || null,

        status: iot.status,
        createdAt: formatDateToDDMMYYYY(iot.createdAt),
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};
