import { Metadata } from "next";
import ChatPage from "./ChatPage";

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
