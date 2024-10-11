import {
  PHAnalytics,
  NPKAnalytics,
  ExperimentsTable,
  TemperatureAnalytics,
  HumidityMoistureAnalytics,
} from "~/components/ui/activity";
import { myenv } from "~/lib/myenv";
import React, { Suspense } from "react";
import { getFakeIotData } from "~/test/data/faker";
import { getFormattedDateActivityDetails } from "~/lib/formatters/date";
import {
  deleteExperimentsData,
  getExperimentsData,
} from "~/app/server/experiments";

export default async ({
  experimentsId,
  isNotPredicted,
}: {
  experimentsId: string;
  isNotPredicted: boolean;
}) => {
  // const eventSource = new EventSource(`/api/iot`)

  const data: Experiments_Data[] =
    myenv === "test"
      ? await getFakeIotData()
      : await getExperimentsData(experimentsId);

  const temperatureData = data.map((item) => ({
    temperature: item.temperature,
    createdAt: item.createdAt,
  }));

  const minTemperature = Math.min(
    ...temperatureData.map((item) => item.temperature)
  );
  const maxTemperature = Math.max(
    ...temperatureData.map((item) => item.temperature)
  );

  const phData = data.map((item) => ({
    ph: item.ph,
    createdAt: item.createdAt,
  }));

  const totalNPK = data.reduce(
    (acc, item) => {
      acc.nitrogen += item.nitrogen;
      acc.phosphorus += item.phosphorus;
      acc.potassium += item.potassium;
      return acc;
    },
    { nitrogen: 0, phosphorus: 0, potassium: 0 }
  );
  const dataLength = data.length;
  const averageN = totalNPK.nitrogen / dataLength;
  const averageP = totalNPK.phosphorus / dataLength;
  const averageK = totalNPK.potassium / dataLength;

  const humidityMoistureData = data.map((item) => ({
    humidity: item.humidity,
    moisture: item.moisture,
    createdAt: item.createdAt,
  }));

  // const dates = data.map(item => item.createdAt).sort((a, b) => a.getTime() - b.getTime());
  const startDate: string =
    dataLength > 0 ? getFormattedDateActivityDetails(data[0].createdAt) : null;
  const endDate: string =
    dataLength > 0
      ? getFormattedDateActivityDetails(data[dataLength - 1].createdAt)
      : null;

  return (
    <>
      <div className="">
        <div className="w-full">
          <div
            className={`${dataLength > 25 ? `w-full` : `flex flex-col md:flex-row w-full`}`}
          >
            <Suspense fallback={<AnalyticsLoading />}>
              <TemperatureAnalytics
                data={temperatureData}
                dataLength={dataLength}
                range={{ min: minTemperature, max: maxTemperature }}
              />
            </Suspense>
            <Suspense fallback={<AnalyticsLoading />}>
              <HumidityMoistureAnalytics
                data={humidityMoistureData}
                dataLength={dataLength}
              />
            </Suspense>
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <Suspense fallback={<AnalyticsLoading />}>
              <PHAnalytics data={phData} dataLength={dataLength} />
            </Suspense>
            <Suspense fallback={<AnalyticsLoading />}>
              <NPKAnalytics
                N={averageN}
                P={averageP}
                K={averageK}
                dataLength={dataLength}
              />
            </Suspense>
          </div>
        </div>
        <ExperimentsTable
          data={data}
          startDate={startDate}
          endDate={endDate}
          actionOnData={isNotPredicted ? deleteExperimentsData : null}
        />
      </div>
    </>
  );
};

const AnalyticsLoading: React.FC = (): React.ReactNode => {
  return (
    <div>
      <ul className="list-disc mt-4 space-y-2">
        <span
          className="inline-block h-52 rounded-2xl animate-pulse w-full bg-gray-300 dark:bg-slate-700/70 mb-2"
          style={{
            animationDelay: `0.5s`,
            animationDuration: "1s",
          }}
        />
      </ul>
    </div>
  );
};
