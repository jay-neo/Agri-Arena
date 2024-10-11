import ReactMarkdown from "react-markdown";
import { getExperimentsData } from "~/app/server/experiments";
import { getPredictionsData } from "~/app/server/ml";
import { ExperimentsTable } from "~/components/ui/activity";
import { getFormattedDateActivityDetails } from "~/lib/formatters";

export default async ({
  predictionsId,
  experimentsId,
}: {
  predictionsId: string;
  experimentsId: string;
}) => {
  const data = await getPredictionsData(predictionsId);

  const experimentsData: Experiments_Data[] =
    await getExperimentsData(experimentsId);

  const dataLength = experimentsData.length;
  const startDate: string =
    dataLength > 0
      ? getFormattedDateActivityDetails(experimentsData[0].createdAt)
      : null;
  const endDate: string =
    dataLength > 0
      ? getFormattedDateActivityDetails(
          experimentsData[dataLength - 1].createdAt
        )
      : null;

  return (
    <div className="mx-1.5 mt-10">
      <ExperimentsTable
        data={experimentsData}
        startDate={startDate}
        endDate={endDate}
      />
      <div>
        {data.map((item, index) => (
          <div key={index}>
            {item.role === "model" ? (
              <div className="my-3">
                <div className="font-bold text-2xl">
                  <span className="mr-2">Model:</span>
                  <span className="text-lime-600 dark:text-lime-200">
                    {item.modelResponse.name}
                  </span>
                </div>
                <div>
                  {"Number of possibilities = " + item.modelResponse.number}
                </div>
                <div className="mt-2 w-full">
                  <table className="min-w-[20rem] max-w-full table-auto text-center border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-purple-200 dark:bg-purple-900">
                        <th className="p-2 border border-gray-300">Result</th>
                        <th className="p-2 border border-gray-300">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.modelResponse.result.map(
                        (result: string, i: number) => (
                          <tr key={i}>
                            <td className="p-2 border border-gray-300">
                              {result}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {item.modelResponse.accuracy[i] + "%"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : item.role === "ai" ? (
              item.text.map((t: string, i) =>
                i % 2 === 0 ? (
                  <div
                    className="font-semibold text-3xl text-rose-500 dark:text-rose-400 mt-5 mb-1"
                    key={i}
                  >
                    {t}
                  </div>
                ) : (
                  <ReactMarkdown key={i}>{t}</ReactMarkdown>
                )
              )
            ) : (
              item.role === "user" && <div>{item.text}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
