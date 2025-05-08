"use server";
import { getActivities } from "~/app/server/activity/getActivities";

export const getActivitiesAction = async (
  topic?: string,
  query?: string,
  page: number = 1,
  limit: number = 10
) => {
  return await getActivities(topic, query, page, limit);
};
