"use client";

import * as React from "react";
import { isMobile } from "~/lib/utils";
import { LineChart } from "@mui/x-charts/LineChart";

export default ({
  data,
  dataLength,
}: {
  data: {
    humidity: number;
    moisture: number;
    createdAt: Date;
  }[];
  dataLength: number;
}) => {
  const isSameDay = data.every(
    (item) =>
      item.createdAt.toDateString() === data[0].createdAt.toDateString(),
  );

  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <div
      className={`md:m-1 my-2 ${dataLength > 25 ? `md:w-full` : `md:w-1/2`} ${isMobileDevice ? "pointer-events-none touch-none" : ""}`}
    >
      <LineChart
        xAxis={[
          {
            scaleType: "time",
            data: data.map((item) => item.createdAt),
            valueFormatter: (value) =>
              isSameDay
                ? value
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toUpperCase() // Standardize to "10:40 PM" format
                : value.toLocaleDateString(),
          },
        ]}
        series={[
          {
            label: "Humidity",
            data: data.map((item) => item.humidity),
            valueFormatter: (value) =>
              value == null ? "NaN" : value.toString(),
          },
          {
            label: "Moisture",
            data: data.map((item) => item.moisture),
            valueFormatter: (value) =>
              value == null ? "NaN" : value.toString(),
          },
        ]}
        yAxis={[
          {
            label: "(in %)",
          },
        ]}
        height={300}
        margin={{ top: 50, bottom: 20, right: 30, left: 50 }}
      />
    </div>
  );
};
