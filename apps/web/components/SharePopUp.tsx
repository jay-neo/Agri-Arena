"use client";

import {
  TwitterIcon,
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "~/lib/arena-icons";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Qwitcher_Grypen } from "next/font/google";

const pacifico = Qwitcher_Grypen({
  weight: "700",
  subsets: ["latin"],
});

export const SharePopUp = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const shareText =
    "AgriArena is an IoT-based platform leveraging machine learning for crop predictions, image processing for disease detection, weather forecasting, smart farming management to enhance agricultural productivity\
    \n\nCheck out my activity on AgriArena:\n";
  const shareUrl = url;

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}${encodeURIComponent(shareUrl)}`;
  const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-4">
      <p
        className={`${pacifico.className} mb-4 text-center dark:text-white text-4xl text-gray-600`}
      >
        share your AgriArena activity via
      </p>

      <div className="flex justify-center gap-4 mb-4">
        <Link
          href={whatsappLink}
          className="bg-blue-400 rounded-full text-white hover:bg-blue-800"
        >
          <Image src={WhatsAppIcon} alt="whatsapp" width={60} height={50} />
        </Link>
        <Link
          href={facebookLink}
          className="bg-blue-400 rounded-full text-white hover:bg-blue-700"
        >
          <Image src={FacebookIcon} alt="facebook" width={60} height={50} />
        </Link>
        <Link
          href={telegramLink}
          className="bg-blue-400 rounded-full text-white hover:bg-blue-500"
        >
          <Image src={TelegramIcon} alt="telegram" width={60} height={50} />
        </Link>
        <Link
          href={twitterLink}
          className="bg-blue-400 rounded-full text-white hover:bg-blue-800"
        >
          <Image src={TwitterIcon} alt="twitter" width={60} height={50} />
        </Link>
      </div>

      <div className="flex items-center gap-2 border rounded p-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-2 py-1 text-gray-600 bg-gray-100 dark:bg-pink-200 rounded outline-none"
        />
        <button
          className="px-4 py-1 bg-rose-500/70 text-white rounded hover:bg-rose-500"
          onClick={copyToClipboard}
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};
