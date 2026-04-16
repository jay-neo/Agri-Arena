"use server";

import { revalidatePath } from "next/cache";

export async function getArenasWithParamsAction() {
  revalidatePath(`/my/arena`);
}
