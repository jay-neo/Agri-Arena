"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";
import { EventFormState } from "./events.schema";
import { validateEventFormData } from "./validateEventFormData";

export const createEventAction = async (
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> => {
  try {
    // console.log("formData ==> ", formData);

    const user = await getUser();
    const validatedFields = validateEventFormData(formData);

    if (!validatedFields.success) {
      // console.log("Validation Error =>", {
      //   errors: validatedFields.error.flatten().fieldErrors,
      // });
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const {
      startDate,
      startTime,
      endDate,
      endTime,
      alarmDate,
      alarmTime,
      title,
      status,
      description,
      location,
      arenaId,
    } = validatedFields.data;

    // Combine date and time into Date objects
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);
    const alarmDateTime = alarmTime
      ? new Date(`${alarmDate || startDate}T${alarmTime}:00`)
      : null;

    await db.event.create({
      data: {
        title,
        description,
        location,
        startTime: startDateTime,
        endTime: endDateTime,
        alarmTime: alarmDateTime,
        userId: user.id,
        status: status,
        author: "user",
        arenaId: arenaId ? arenaId : undefined,
      },
    });

    revalidatePath(`/my/events`);
    return {
      success: "Event created successfully",
      next: `/my/events`,
    };
  } catch (error) {
    console.error("Error creating event => ", error);
    return {
      error: error?.message || "Something went wrong!",
    };
  }
};
