import { Metadata } from "next";
import Calendar from "./Calender";

export const metadata: Metadata = {
  title: "Events",
};

export default async () => (
  <div className="bg-inherit p-5 text-gray-900 dark:text-white">
    <Calendar />
  </div>
);
