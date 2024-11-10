import { HOMEPAGE } from "~/lib/routes";
import { redirect } from "next/navigation";

export default () => {
  return redirect(HOMEPAGE);
};
