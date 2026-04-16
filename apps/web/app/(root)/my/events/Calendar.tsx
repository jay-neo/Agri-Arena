"use client";

import moment from "moment";
import React, { Suspense, useState } from "react";
import EventList from "./EventList";
import CalendarToolbar from "./CalendarToolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useTheme } from "~/components/providers/mui/MuiThemeProvider";

const EventForm = React.lazy(() => import("./EventForm"));
const localizer = momentLocalizer(moment);

const MyCalendar = ({
  eventsScope,
  intialEvents,
}: {
  eventsScope: string[];
  intialEvents: UserEvent[];
}) => {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<UserEvent[]>(intialEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);

  const handleViewChange = (newView: "month" | "week" | "day") => {
    setView(newView);
  };

  const { themeMode } = useTheme();

  const handleAddEvent = (newEvent: UserEvent) => {
    setEvents([...events, newEvent]);
    setSelectedEvent(null);
    setIsFormOpen(false);
  };

  const handleDeleteEvent = (eventId: string) =>
    setEvents(events.filter((e) => e.id != eventId));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: UserEvent) => {
    setSelectedDate(event.startTime);
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="startTime" // Changed from "start" to "startTime"
        endAccessor="endTime" // Changed from "end" to "endTime"
        defaultView={Views.MONTH}
        view={view}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={(newDate: Date) => setCurrentDate(newDate)}
        components={{
          toolbar: (props) => (
            <CalendarToolbar
              {...props}
              prevView={view}
              onAddEvent={() => {
                setSelectedEvent(null);
                setIsFormOpen(true);
              }}
            />
          ),
        }}
        style={{ height: 600 }}
        views={["month", "week", "day"]}
        dayPropGetter={(date: Date) => {
          const currentMonth = moment(currentDate).month();
          const isToday = moment(date).isSame(moment(), "day");
          const isCurrentMonth = moment(date).month() === currentMonth;
          const isSelected = moment(date).isSame(selectedDate, "day");

          if (isSelected) {
            return {
              className: "!bg-yellow-200 dark:!bg-yellow-900", // Distinct color for selected date
            };
          } else if (isToday) {
            return {
              className: "!bg-[#e2a6f3] dark:!bg-[#541d74]",
            };
          } else if (isCurrentMonth) {
            return {
              className: "bg-[#f2d7fa] dark:bg-[#282858]",
            };
          } else {
            return {
              className: "!bg-inherit",
            };
          }
        }}
        eventPropGetter={(event: UserEvent) => {
          return {
            style: {
              backgroundColor: event?.arena?.colorCode,
              borderColor: event?.arena?.colorCode,
              color: themeMode == "dark" ? "#fff" : "#000",
              opacity: event.status === "CANCELLED" ? 0.6 : 1,
            },
          };
        }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      <EventList events={events} selectedDate={selectedDate} />
      <Suspense fallback={<></>}>
        <EventForm
          isOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />
      </Suspense>
    </div>
  );
};

export default MyCalendar;
