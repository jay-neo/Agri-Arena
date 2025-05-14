"use client";

import {
  BarPlot,
  LinePlot,
  ChartsGrid,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  BarSeriesType,
  LineSeriesType,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { Box, Stack } from "@mui/material";

const series: (LineSeriesType | BarSeriesType)[] = [
  { type: "line", dataKey: "humidity", color: "#3b00de", label: "Humidity" },
  { type: "line", dataKey: "moisture", color: "#00f1ca", label: "Moisture" },
  { type: "line", dataKey: "nitrogen", color: "#17ff00", label: "Nitrogen" },
  {
    type: "line",
    dataKey: "phosphorus",
    color: "#bf0000",
    label: "Phosphorus",
  },
  { type: "line", dataKey: "potassium", color: "#ff14ee", label: "Potassium" },
  {
    type: "bar",
    dataKey: "temperature",
    color: "#D16BA5",
    yAxisId: "leftAxis",
    label: "Temperature",
  },
  {
    type: "bar",
    dataKey: "ph",
    color: "#ab16e9",
    yAxisId: "rightAxis",
    label: "pH",
  },
];

export default ({ data }: { data: any }) => {
  let dataset = data;

  return (
    <Stack sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <ResponsiveChartContainer
          series={series}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "month",
              label: "Month",
              reverse: false,
            },
          ]}
          yAxis={[
            { id: "leftAxis", reverse: false, label: "Temperature (°C)" },
            { id: "rightAxis", reverse: false, position: "right", label: "Hd" },
          ]}
          dataset={dataset}
          height={400}
        >
          <ChartsGrid horizontal />
          <BarPlot />
          <LinePlot />
          <LinePlot />
          <LinePlot />
          <LinePlot />

          <ChartsXAxis />
          <ChartsYAxis axisId="leftAxis" />
          <ChartsYAxis axisId="rightAxis" position="right" />
          <ChartsTooltip />
        </ResponsiveChartContainer>
      </Box>
    </Stack>
  );
};
