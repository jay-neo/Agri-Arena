"use client";

import { LineChart } from "@mui/x-charts/LineChart";

export default ({
  data,
  dataLength,
}: {
  data: {
    humidity: number;
    moisture: number;
    createdAt: any;
  }[];
  dataLength: number;
}) => {
  return (
    <div
      className={`md:m-1 my-2  ${dataLength > 25 ? `md:w-full` : `md:w-1/2`}`}
    >
      <LineChart
        xAxis={[
          {
            scaleType: "time",
            data: data.map((item) => item.createdAt),
            valueFormatter: (value) => value.toLocaleDateString(),
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
            // label: "(in %)",
          },
        ]}
        height={300}
        margin={{ top: 50, bottom: 20, right: 30, left: 50 }}
      />
    </div>
  );
};
