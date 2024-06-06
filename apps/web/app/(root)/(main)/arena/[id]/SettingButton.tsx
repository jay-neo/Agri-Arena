"use client";

import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { Setting } from "~/lib/arena-icons";
import { deleteArena } from "~/app/server/arena";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";

export default ({
  arenaId,
  isEditing,
  setIsEditing,
}: {
  arenaId: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [ifSettingButtonClicked, setIfSettingButtonClicked] = useState(false);
  const dropdownRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIfSettingButtonClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSettingButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIfSettingButtonClicked(true);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    setIfSettingButtonClicked(false);
  };

  return (
    <div className="mr-0.5">
      <Tooltip describeChild placement="left-start" title="Settings">
        <motion.button
          type="button"
          onClick={handleSettingButtonClick}
          className="p-2 dark:bg-gray-800 text-white rounded-full shadow-lg"
          animate={{ rotate: ifSettingButtonClicked ? 60 : 0 }}
          transition={{ duration: 0.5 }}
          aria-expanded={ifSettingButtonClicked}
        >
          <Image
            src={Setting}
            alt="O"
            width={18}
            height={18}
            className="dark:invert"
          />
        </motion.button>
      </Tooltip>

      {ifSettingButtonClicked && (
        <div
          className="absolute right-0 mt-8 mr-2 xl:mr-40 w-32 divide-gray-100 rounded-lg shadow bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
          role="menu"
          aria-orientation="vertical"
          ref={dropdownRef}
        >
          <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditClick}
                className="flex w-full rounded-md cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                await deleteArena(arenaId);
                toast.success("Arena deleted successfully.");
              }}
              className="flex w-full rounded-md cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-red-600 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-red-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
