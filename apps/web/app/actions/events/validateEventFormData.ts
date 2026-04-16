import { EventFormSchema } from "./events.schema";

export const validateEventFormData = (formData: FormData) => {
  return EventFormSchema.safeParse({
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
};
