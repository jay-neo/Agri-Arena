"use client";

import Image from "next/image";
import { Button } from "@mui/material";
import { useTheme } from "./MuiThemeProvider";
import { ThemeSun, ThemeMoon } from "~/lib/arena-icons";

export default () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${
        themeMode === "light"
          ? "bg-gray-100 hover:bg-gray-300 rounded-md "
          : "bg-gray-800 hover:bg-black  rounded-md "
      } rounded-md p-1`}
    >
      <Image
        src={themeMode === "light" ? ThemeMoon : ThemeSun}
        alt={themeMode === "light" ? "Moon" : "Sun"}
        width={20}
        height={20}
        className="w-5 h-5 dark:invert"
      />
    </button>
  );
};
