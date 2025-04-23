"use server";

import { revalidatePath } from "next/cache";

export const getActivitiesWithParams = async () => {
  revalidatePath(`/my/activity`);
};
