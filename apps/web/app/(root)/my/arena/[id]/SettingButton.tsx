"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";
import { Setting } from "~/lib/arena-icons";
import { deleteArenaAction } from "~/app/actions/arena";

export default ({
  arenaIdx,
  isEditable,
}: Readonly<{
  arenaIdx: number;
  isEditable: boolean;
}>) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [ifSettingButtonClicked, setIfSettingButtonClicked] =
    React.useState(false);
  const dropdownRef: React.MutableRefObject<HTMLDivElement | null> =
    React.useRef(null);
  const router = useRouter();

  React.useEffect(() => {
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteArenaAction(arenaIdx);
      toast.success("Arena successfully deleted");
      router.push(`/my/arena`);
    } catch (error) {
      console.error("Failed to delete arena:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="mr-[0.30rem]">
      <Tooltip describeChild placement="left-start" title="Settings">
        <motion.button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIfSettingButtonClicked(true);
          }}
          className="p-2 dark:bg-gray-800 text-white rounded-full shadow-lg"
          animate={{ rotate: ifSettingButtonClicked ? 60 : 0 }}
          aria-expanded={ifSettingButtonClicked}
          transition={{ duration: 0.5 }}
        >
          <Image
            alt="O"
            width={18}
            height={18}
            src={Setting}
            className="dark:invert"
          />
        </motion.button>
      </Tooltip>

      {ifSettingButtonClicked && (
        <div
          className="absolute right-0 mt-3 mr-1 lg:mr-4 w-32 divide-gray-100 rounded-lg shadow bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
          role="menu"
          aria-orientation="vertical"
          ref={dropdownRef}
        >
          <div className="block my-0.5 py-1 text-sm text-center text-gray-700 dark:text-gray-200">
            {isEditable && (
              <Link
                type="button"
                href={`${arenaIdx}/edit`}
                className="flex w-full px-4 py-2 mx-auto text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white"
              >
                Edit
              </Link>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex w-full cursor-pointer px-4 py-2 text-gray-700 hover:bg-red-400 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-red-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white duration-200 transition-all"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
