"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "~/lib/arena-icons";
import Tooltip from "@mui/material/Tooltip";
import ImageProcessingForm from "./ImageProcessingForm";

export default () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="block">
      <Tooltip describeChild title="Detect disease using Image Processing">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex flex-row text-sm px-2.5 py-2 text-white font-semibold rounded-lg transition duration-300 bg-gray-50  hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 shadow-surface-elevation-low hover:shadow-surface-elevation-medium focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <Image
            src={Camera}
            alt="Camera"
            width={28}
            height={28}
            className="dark:invert"
          />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6">
          <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>

          <div className="relative bg-yellow-50 dark:bg-[#2f2f61] p-5 md:p-10 scrollbar-hide rounded-lg shadow-lg w-full max-w-xl max-h-full h-auto overflow-auto">
            <button
              onClick={onClose}
              className="absolute top-2 right-5 text-gray-600 hover:text-gray-900 text-3xl dark:invert"
            >
              &times;
            </button>
            <ImageProcessingForm />
          </div>
        </div>
      )}
    </div>
  );
};
