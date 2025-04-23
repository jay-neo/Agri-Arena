import { HOMEPAGE } from "../lib/routes";
import { redirect } from "next/navigation";

export default async () => {
  return redirect(HOMEPAGE);
};
