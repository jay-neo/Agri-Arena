import Link from "next/link";
import Image from "next/image";
import { WeatherCard } from "./WeatherCard";
import { getAgricultureSchema } from "~/app/actions/forecast/getAgricultureSchema";

export default async function Page() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const linkPreviewApiKey = process.env.NEXT_PUBLIC_LINKPREVIEW_API_KEY;

  // Fetch news
  let articlesWithPreviews = [];
  try {
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=agriculture+schemes+India&apiKey=${newsApiKey}`,
    );
    const newsData = await newsResponse.json();
    const articles = newsData.articles.slice(1, 7);

    // Fetch news previews
    const newsPreviewPromises = articles.map(async (article) => {
      try {
        const previewResponse = await fetch(
          `https://api.linkpreview.net/?q=${encodeURIComponent(article.url)}`,
          {
            headers: {
              "X-Linkpreview-Api-Key": linkPreviewApiKey,
            },
          },
        );
        const previewData = await previewResponse.json();
        return {
          ...article,
          preview: previewData,
        };
      } catch (error) {
        console.error(
          "Error fetching preview for article:",
          article.url,
          error,
        );
        return {
          ...article,
          preview: {
            title: article.title,
            description: "",
            image: "",
            url: article.url,
          },
        };
      }
    });

    articlesWithPreviews = await Promise.all(newsPreviewPromises);
  } catch (error) {
    console.error("Error fetching news:", error);
    articlesWithPreviews = [];
  }

  const schemes = await getAgricultureSchema();

  // Fetch schemes previews
  // const schemesPreviewPromises = schemes.map(async (scheme) => {
  //   try {
  //     const previewResponse = await fetch(
  //       `https://api.linkpreview.net/?q=${encodeURIComponent(scheme.link)}`,
  //       {
  //         headers: {
  //           'X-Linkpreview-Api-Key': linkPreviewApiKey,
  //         },
  //       }
  //     );
  //     const previewData = await previewResponse.json();
  //     return {
  //       ...scheme,
  //       preview: previewData,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching preview for scheme:', scheme.link, error);
  //     return {
  //       ...scheme,
  //       preview: { title: scheme.name, description: '', image: '', url: scheme.link },
  //     };
  //   }
  // });
  // const schemesWithPreviews = await Promise.all(schemesPreviewPromises);
  const schemesWithPreviews = schemes;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // console.log("articlesWithPreviews =>", articlesWithPreviews)
  // console.log("schemesWithPreviews =>", schemesWithPreviews)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Weather & Agriculture Updates
      </h1>
      <WeatherCard />
      {schemesWithPreviews.length != 0 && (
        <div className="bg-white/10 dark:bg-black/10 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Top Agriculture Schemes
          </h2>
          <ul className="list-disc pl-5">
            {schemesWithPreviews.map((scheme, index) => (
              <li key={index} className="mb-4">
                <div className="flex">
                  {/* {scheme.preview.image && (
                    <img src={scheme.preview.image} alt="Preview" className="w-32 h-32 object-cover mr-4" />
                  )} */}
                  <div>
                    <Link
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {scheme.name}
                    </Link>
                    {/* <p>{scheme.preview.description}</p> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {articlesWithPreviews.length != 0 && (
        <div className="mb-6 bg-white/10 dark:bg-black/10 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Agriculture News</h2>
          <ul className="list-disc pl-5">
            {articlesWithPreviews.map((article, index) => (
              <div
                key={index}
                className="my-3 bg-sky-200/80 dark:bg-white/5 hover:bg-sky-300/80 dark:hover:bg-white/10 p-4 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {(article.urlToImage || article.preview.image) && (
                    <img
                      width={20}
                      height={20}
                      src={article.urlToImage || article.preview.image}
                      alt=""
                      className="w-full md:w-2/5 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <Link
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-lg font-semibold hover:underline"
                    >
                      {article.preview.title || article.title}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      By {article.author || "Unknown Author"} •{" "}
                      {formatDate(article.publishedAt)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 mt-2 line-clamp-3">
                      {article.description || article.preview.description || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
