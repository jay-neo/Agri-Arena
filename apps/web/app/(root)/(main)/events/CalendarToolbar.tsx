import React from "react";
import { capitalize } from "~/lib/formatters";

interface CustomToolbarProps {
  view?: string;
  prevView?: string;
  label?: string;
  navigate?: string;
  onView?: (view: "month" | "week" | "day") => void;
  onNavigate?: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export const CalendarToolbar: React.FC<CustomToolbarProps> = ({
  label,
  onNavigate,
  onView,
  prevView,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col md:flex-row gap-2">
        <NavigateButton navigate="prev" onNavigate={onNavigate} />
        <NavigateButton navigate="today" onNavigate={onNavigate} />
        <NavigateButton navigate="next" onNavigate={onNavigate} />
      </div>

      <span className="text-gray-900 dark:text-white font-bold">{label}</span>

      <div className="flex flex-col md:flex-row gap-2">
        <ViewButton prevView={prevView} view="month" onView={onView} />
        <ViewButton prevView={prevView} view="week" onView={onView} />
        <ViewButton prevView={prevView} view="day" onView={onView} />
      </div>
    </div>
  );
};

const ViewButton: React.FC<CustomToolbarProps> = ({
  prevView,
  view,
  onView,
}) => {
  return (
    <button
      className={`w-24 py-2 border ${
        prevView === view
          ? "bg-gray-500 text-white"
          : "bg-inherit text-gray-900 dark:text-white"
      } hover:bg-gray-700 hover:text-white`}
      onClick={() => onView(view as "month" | "week" | "day")}
    >
      {capitalize(view)}
    </button>
  );
};

const NavigateButton: React.FC<CustomToolbarProps> = ({
  navigate,
  onNavigate,
}) => {
  return (
    <button
      className="hover:text-white w-24 py-2 border bg-inherit text-gray-900 dark:text-white hover:bg-gray-700"
      onClick={() =>
        onNavigate(navigate.toUpperCase() as "PREV" | "NEXT" | "TODAY")
      }
    >
      {capitalize(navigate)}
    </button>
  );
};
