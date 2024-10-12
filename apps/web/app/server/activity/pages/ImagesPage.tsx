"use server";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getImagesData } from "~/app/server/ip";

export const ImagesPage = async ({ imagesId }: { imagesId: string }) => {
  const data = await getImagesData(imagesId);

  return (
    <div className="mx-1.5 mt-10">
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
            ) : item.role === "user" && item.type === "image" ? (
              <div className="flex items-center justify-center">
                <Image
                  className="max-w-full w-full md:w-max h-[27rem] rounded-xl shadow-lg mx-1"
                  src={item.image}
                  alt="Image"
                  width={400}
                  height={200}
                />
              </div>
            ) : item.type === "text" ? (
              <div>{item.text}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
