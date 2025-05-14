"use client";

import moment from "moment";

interface EventListProps {
  events: UserEvent[];
  selectedDate: Date;
}

const EventList: React.FC<EventListProps> = ({ events, selectedDate }) => {
  // Filter and sort events for the selected date
  const filteredEvents = events
    .filter((event) => moment(event.startTime).isSame(selectedDate, "day"))
    .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

  // Fallback color palette for events without arena.colorCode
  const fallbackColors = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
  ];

  // Status color mapping
  const statusColors: { [key: string]: string } = {
    PENDING: "#f59e0b", // Yellow
    ONGOING: "#10b981", // Green
    FINISHED: "#6b7280", // Gray
    CANCELLED: "#ef4444", // Red
  };

  return (
    <div className="mt-6 p-6 bg-fuchsia-100/20 dark:bg-black/20 rounded-xl shadow-lg transition-all duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Events for {moment(selectedDate).format("MMMM D, YYYY")}
      </h2>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          No events scheduled for this date.
        </p>
      ) : (
        <div className="relative pl-6">
          {filteredEvents.map((event, index) => {
            // Use arena.colorCode if available, else fallback
            const eventColor =
              event.arena?.colorCode ||
              fallbackColors[index % fallbackColors.length];
            // Get status color, default to gray if status is unknown
            const statusColor =
              statusColors[event.status.toUpperCase()] || "#6b7280";

            return (
              <div
                key={event.id}
                className="mb-10 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-all duration-200"
              >
                {/* Timeline Dot and Line */}
                <div
                  className="absolute -left-[8px] top-5 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"
                  style={{ backgroundColor: eventColor }}
                ></div>
                {/* Vertical line connecting dots, hidden for the last event */}
                {index == 0 && index != filteredEvents.length - 1 ? (
                  <div
                    className="absolute left-[1px] top-8 h-[calc(100%)] w-0.5"
                    style={{ backgroundColor: eventColor }}
                  ></div>
                ) : index < filteredEvents.length - 1 ? (
                  <div
                    className="absolute left-[1px] -top-2 h-[calc(100%)] w-0.5"
                    style={{ backgroundColor: eventColor }}
                  ></div>
                ) : (
                  filteredEvents.length != 1 && (
                    <div
                      className="absolute left-[1px] -top-12 h-full w-0.5"
                      style={{ backgroundColor: eventColor }}
                    ></div>
                  )
                )}
                {/* Event Content */}
                <div className="ml-6">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                      {event.title}
                    </h3>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full uppercase"
                      style={{
                        backgroundColor: `${statusColor}33`, // 20% opacity of status color
                        color: statusColor,
                      }}
                    >
                      {event.status}
                    </span>
                    {event.arena && (
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${eventColor}33`, // 20% opacity of arena color
                          color: eventColor,
                        }}
                      >
                        {event.arena.title}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {event.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {moment(event.startTime).format("h:mm A")} -{" "}
                    {moment(event.endTime).format("h:mm A")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
