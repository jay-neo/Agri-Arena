"use server";

import ReactMarkdown from "react-markdown";
import { getPredictionsData } from "~/app/server/ml";
import { ExperimentsTable } from "~/components/ui/activity";
import { getExperimentsData } from "~/app/server/experiments";
import { getFormattedDateActivityDetails } from "~/lib/formatters";
import { CustomLinkPreview } from "~/components/ui/previews/CustomLinkPreview";
import { LinkPreview } from "~/components/ui/previews/LinkPreview";
import { extractUrls } from "~/lib/utils/url";

export const PredictionsPage = async ({
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

  const elements: JSX.Element[] = [];

  elements.push(
    <ExperimentsTable
      data={experimentsData}
      startDate={startDate}
      endDate={endDate}
    />
  );

  // Outer loop using 'for'
  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    if (item.role === "model") {
      elements.push(
        <div key={index} className="my-3">
          <div className="font-bold text-2xl">
            <span className="mr-2">Model:</span>
            <span className="text-lime-600 dark:text-lime-200">
              {item.modelResponse.name}
            </span>
          </div>
          <div>{"Number of possibilities = " + item.modelResponse.number}</div>
          <div className="mt-2 w-full">
            <table className="min-w-[20rem] max-w-full table-auto text-center border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-purple-200 dark:bg-purple-900">
                  <th className="p-2 border border-gray-300">Result</th>
                  <th className="p-2 border border-gray-300">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop over the results and accuracies */}
                {item.modelResponse.result.map((result: string, i: number) => (
                  <tr key={i}>
                    <td className="p-2 border border-gray-300">{result}</td>
                    <td className="p-2 border border-gray-300">
                      {item.modelResponse.accuracy[i] + "%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (item.role === "ai") {
      for (let i = 0; i < item.text.length; i++) {
        if (i % 2 === 0) {
          elements.push(
            <div
              key={`${index}-${i}`}
              className="font-semibold text-3xl text-rose-500 dark:text-rose-400 mt-5 mb-1"
            >
              {item.text[i]}
            </div>
          );
        } else {
          if ((item.text[i - 1] as string) === "Links") {
            // const links = item.text[i].trim().split(/\s+/);
            const links = extractUrls(item.text[i]);
            {
              links.map((link, index) => {
                console.log(link);
                elements.push(<CustomLinkPreview key={index} link={link} />);
                // elements.push(<LinkPreview key={index} link={link} />);
              });
            }
          } else {
            elements.push(
              <ReactMarkdown key={`${index}-${i}`}>
                {item.text[i]}
              </ReactMarkdown>
            );
          }
        }
      }
    } else if (item.role === "user") {
      elements.push(<div key={index}>{item.text}</div>);
    }
  }

  return <div className="mx-1.5 mt-10">{elements}</div>;
};
