"use client";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { isMobile } from "~/lib/utils";

export default ({
  data,
  dataLength,
  range,
}: {
  data: {
    temperature: number;
    createdAt: Date;
  }[];
  dataLength: number;
  range: {
    min: number;
    max: number;
  };
}) => {
  const isSameDay = data.every(
    (item) =>
      item.createdAt.toDateString() === data[0].createdAt.toDateString(),
  );

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <div
      className={`md:m-1 my-2 ${dataLength > 25 ? `md:w-full` : `md:w-1/2`} ${isMobileDevice ? "pointer-events-none touch-none" : ""}`}
    >
      <LineChart
        className="dark:text-white dark:from-neutral-50"
        height={300}
        grid={{ horizontal: true }}
        series={[
          {
            data: data.map((item) => item.temperature),
            area: true,
          },
        ]}
        margin={{
          top: 10,
          bottom: 20,
          right: 30,
        }}
        yAxis={[
          {
            label: "Temperature (°C)",
            min: range.min - 10,
            max: range.max + 10,
            colorMap: {
              type: "continuous",
              min: range.min,
              max: range.max,
              color: ["blue", "red"],
            },
          },
        ]}
        xAxis={[
          {
            scaleType: "time",
            data: data.map((item) => item.createdAt),
            valueFormatter: (value) =>
              isSameDay
                ? value.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : value.toLocaleDateString(),
          },
        ]}
      />
    </div>
  );
};
