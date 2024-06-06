import { Metadata } from "next";
import { ChatPage } from "~/app/server/ai";

export const metadata: Metadata = {
  title: "Activity",
};

export default async () => {
  return (
    <div className="">
      <ChatPage />
    </div>
  );
};
