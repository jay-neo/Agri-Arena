"use server";

import { db } from "~/lib/prisma";
import { getUser } from "../user";
import { revalidatePath } from "next/cache";
import { EventFormSchema, EventFormState } from "./events.schema";

export const updateEventAction = async (
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> => {
  try {
    console.log("formData ==> ", formData);

    const user = await getUser();
    const validatedFields = EventFormSchema.safeParse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      startTime: formData.get("startTime"),
      endDate: formData.get("endDate"),
      endTime: formData.get("endTime"),
      alarmDate: formData.get("alarmDate"),
      alarmTime: formData.get("alarmTime"),
      location: formData.get("location"),
      status: formData.get("status"),
      arenaId: formData.get("arenaId"),
    });

    if (!validatedFields.success) {
      console.log("Validation Error =>", {
        errors: validatedFields.error.flatten().fieldErrors,
      });
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
      description,
      location,
      arenaId,
      status,
      title,
      id,
    } = validatedFields.data;

    // Combine date and time into Date objects
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);
    const alarmDateTime = alarmTime
      ? new Date(`${alarmDate || startDate}T${alarmTime}:00`)
      : null;

    await db.event.update({
      where: { id },
      data: {
        title,
        description,
        location,
        startTime: startDateTime,
        endTime: endDateTime,
        alarmTime: alarmDateTime,
        userId: user.id,
        status: status,
        arenaId: arenaId ? arenaId : undefined,
      },
    });

    revalidatePath(`/my/events`);
    return {
      success: "Event updated successfully",
    };
  } catch (error) {
    console.error("Error creating event => ", error);
    return {
      error: error?.message || "Something went wrong!",
    };
  }
};
