"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarToolbar } from "./CalendarToolbar";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const events: Event[] = [
    {
      title: "Meeting",
      start: new Date(2024, 8, 10, 10, 0),
      end: new Date(2024, 8, 10, 12, 0),
    },
    {
      title: "Conference",
      start: new Date(2024, 8, 15, 9, 0),
      end: new Date(2024, 8, 15, 17, 0),
    },
  ];

  const handleViewChange = (newView: "month" | "week" | "day") => {
    setView(newView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      view={view}
      onView={handleViewChange}
      date={currentDate}
      onNavigate={(newDate) => setCurrentDate(newDate)}
      components={{
        toolbar: (props) => (
          <CalendarToolbar
            label={props.label}
            onNavigate={props.onNavigate}
            onView={props.onView}
            prevView={view}
          />
        ),
      }}
      style={{ height: 600 }}
      views={["month", "week", "day"]}
      dayPropGetter={(date) => {
        const currentMonth = moment(currentDate).month();
        const isToday = moment(date).isSame(moment(), "day"); // Use moment() for current day comparison
        const isCurrentMonth = moment(date).month() === currentMonth;

        if (isToday) {
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
    />
  );
};

export default MyCalendar;
