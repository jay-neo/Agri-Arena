"use server";

import { getUser } from "../user";
import { db } from "~/lib/prisma";
import { formatDateToDDMMYYYY } from "~/lib/formatters";
import { IoTFormState, IoTFormSchema } from "./validation";

///////////////////////////////////// CREATE ///////////////////////////////////
export const createIot = async (
  _state: IoTFormState,
  formData: FormData
): Promise<IoTFormState> => {
  const validatedFields = IoTFormSchema.safeParse({
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
    console.log(error.message);
    return {
      error: "Error! We couldn't process your request.",
    };
  }
};

///////////////////////////////////// READ ///////////////////////////////////
export const getIots = async () => {
  try {
    const { id } = await getUser();
    const iots = await db.ioT.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        device: true,
        location: true,
        interval: true,
        createdAt: true,
        status: true,
        arena: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
        description: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return iots.map((iot) => ({
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
      createdAt: iot.createdAt,
    }));
  } catch (error) {
    return null;
  }
};

///////////////////////////////////// UPDATE ///////////////////////////////////
export const updateIot = async (
  _state: IoTFormState,
  formData: FormData
): Promise<IoTFormState> => {
  const validatedFields = IoTFormSchema.safeParse({
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

///////////////////////////////////// DELETE ///////////////////////////////////
export const deleteIot = async (iotId: string) => {
  try {
    const { id } = await getUser();
    await db.ioT.delete({
      where: {
        id: iotId,
        userId: id,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};
