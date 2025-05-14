"use client";

import { ToolbarProps } from "react-big-calendar";

interface CalendarToolbarProps extends ToolbarProps {
  view?: string;
  prevView?: string;
  label?: string;
  navigate?: string;
  onView?: (view: "month" | "week" | "day") => void;
  onNavigate?: (action: "PREV" | "NEXT" | "TODAY") => void;
  onAddEvent: () => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  label,
  onNavigate,
  onView,
  prevView,
  onAddEvent,
}) => {
  const handleViewChange = (newView: "month" | "week" | "day") => {
    onView(newView);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-col md:flex-row gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="px-4 py-2.5 bg-fuchsia-200 dark:bg-indigo-700 rounded hover:bg-fuchsia-300 hover:dark:bg-indigo-800"
        >
          Previous
        </button>
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-4 py-2.5 bg-fuchsia-200 dark:bg-indigo-700 rounded hover:bg-fuchsia-300 hover:dark:bg-indigo-800"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-4 py-2.5 bg-fuchsia-200 dark:bg-indigo-700 rounded hover:bg-fuchsia-300 hover:dark:bg-indigo-800"
        >
          Next
        </button>
      </div>

      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        {label}
      </span>

      <div className="flex flex-col md:flex-row gap-2">
        <button
          onClick={() => handleViewChange("month")}
          className={`px-4 py-2 rounded ${
            prevView === "month"
              ? "bg-fuchsia-200 dark:bg-indigo-800"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => handleViewChange("week")}
          className={`px-4 py-2 rounded ${
            prevView === "week"
              ? "bg-fuchsia-200 dark:bg-indigo-800"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => handleViewChange("day")}
          className={`px-4 py-2 rounded ${
            prevView === "day"
              ? "bg-fuchsia-200 dark:bg-indigo-800"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          Day
        </button>
        <button
          onClick={onAddEvent}
          className="text-3xl px-2 pb-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
