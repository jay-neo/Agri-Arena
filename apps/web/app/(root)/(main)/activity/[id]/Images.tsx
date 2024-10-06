import { getImagesData } from "~/app/server/ip";
import Image from "next/image"; // Ensure Image component is imported if you're using Next.js

export default async ({ imagesId }: { imagesId: string }) => {
  const data = await getImagesData(imagesId);

  return (
    <div className="mx-1 mt-10">
      <div>
        {data.map(
          (item, index) =>
            item.groupId === 0 && (
              <div key={index}>
                {item.type === "image" ? (
                  <Image
                    className="w-full h-[27rem] rounded-xl shadow-lg "
                    src={item.image}
                    alt="Image"
                    width={400}
                    height={200}
                  />
                ) : item.type === "processingResponse" ? (
                  <div className="mt-5 ml-1">
                    <b>{`Image Processing Model Response: `}</b>
                    {item.processingResponse}
                  </div>
                ) : item.type === "text" ? (
                  <div>{item.text}</div>
                ) : null}
              </div>
            )
        )}
      </div>
    </div>
  );
};
