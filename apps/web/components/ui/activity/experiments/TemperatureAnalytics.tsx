"use client";
import { LineChart } from "@mui/x-charts/LineChart";

export default ({
  data,
  dataLength,
  range,
}: {
  data: {
    temperature: number;
    createdAt: any;
  }[];
  dataLength: number;
  range: {
    min: number;
    max: number;
  };
}) => {
  return (
    <div
      className={`md:m-1 my-2 ${dataLength > 25 ? `md:w-full` : `md:w-1/2`}`}
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
            // min: range.min,
            // max: range.max,
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
            valueFormatter: (value) => value.toLocaleDateString(),
          },
        ]}
      />
    </div>
  );
};
