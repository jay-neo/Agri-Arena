import { Metadata } from "next";
import Calendar from "./Calendar";
import { getEvents } from "~/app/actions/events/getEvents";

export const metadata: Metadata = {
  title: "Events",
};

export default async () => {
  const eventsData = await getEvents();
  return (
    <div className="bg-inherit p-5 text-gray-900 dark:text-white">
      <Calendar
        intialEvents={eventsData?.events}
        eventsScope={eventsData?.eventsScope}
      />
    </div>
  );
};
