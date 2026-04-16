"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { isMobile } from "~/lib/utils";

const valueFormatter = (value: number | null) => `${value}`;

export default ({
  data,
  dataLength,
}: {
  data: {
    ph: number;
    createdAt: any;
  }[];
  dataLength: number;
}) => {
  const chartHeight = dataLength > 25 ? dataLength * 20 : 400;
  const chartWidth = dataLength > 25 ? dataLength * 15 : 400;

  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <div
      className={`md:m-1 my-2 content-center ${dataLength > 25 ? `md:w-full` : `md:w-1/2`} ${isMobileDevice ? "pointer-events-none touch-none" : ""}`}
    >
      <BarChart
        dataset={data}
        xAxis={[
          {
            label: "pH value",
            colorMap: {
              type: "piecewise",
              thresholds: [3, 6, 7, 10, 14],
              colors: ["red", "orange", "green", "blue", "purple"],
            },
          },
        ]}
        height={chartHeight}
        yAxis={[
          {
            scaleType: "band",
            dataKey: "createdAt",
            valueFormatter: (value) => value.toLocaleDateString(),
          },
        ]}
        margin={{
          left: 80,
          right: 10,
        }}
        series={[{ dataKey: "ph", valueFormatter }]}
        layout="horizontal"
        grid={{ vertical: true }}
      />
    </div>
  );
};
