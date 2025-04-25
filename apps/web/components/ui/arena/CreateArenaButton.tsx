"use client";

import { useState } from "react";
import { CreateArenaForm } from "~/components/ui/arena/CreateArenaForm";

export const CreateArenaButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-11 h-11 mx-2 my-auto items-center justify-center rounded-lg bg-white dark:bg-white/5 p-2 shadow-surface-elevation-low transition duration-500 hover:bg-sky-300/80 dark:hover:bg-white/10 text-purple-500 dark:text-lime-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-14 h-14 md:w-16 md:h-16"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6">
          <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>

          <div className="relative bg-yellow-50 dark:bg-[#2f2f61] p-5 md:p-10 scrollbar-hide rounded-lg shadow-lg w-full max-w-xl max-h-full h-auto overflow-auto">
            <button
              className="absolute top-2 right-5  text-gray-600 hover:text-gray-900 text-3xl dark:invert"
              onClick={onClose}
            >
              &times;
            </button>

            {/* Dialog Content */}
            <CreateArenaForm onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
};
