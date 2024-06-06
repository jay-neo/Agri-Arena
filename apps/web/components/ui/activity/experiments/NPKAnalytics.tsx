"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default ({ N, P, K, dataLength }: { N: number; P: number; K: number, dataLength: number }) => {
  return (
    <div className={`md:m-1 my-2 content-center ${ dataLength > 25 ? `md:w-full` : `md:w-1/2`}`}>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: N, color: "#05d60c", label: "Nitrogen" },
              { id: 1, value: P, color: "#EB45A3", label: "Phosphorus" },
              { id: 2, value: K, color: "#d71111", label: "Potassium" },
            ],
          },
        ]}
        //   width={400}
        height={200}
        margin={{ right: 140 }}
      />
    </div>
  );
};
