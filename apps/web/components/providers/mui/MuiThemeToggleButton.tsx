"use client";

import { useTheme } from "./themeProvider";
import { Button } from "@mui/material";

import Image from "next/image";
import { ThemeSun, ThemeMoon } from "~/lib/arena-icons";

export default () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className={`${
        themeMode === "light"
          ? "bg-gray-100 hover:bg-gray-300 rounded-md border-purple-400 border-2 p-2"
          : "bg-gray-800 hover:bg-black  rounded-md border-purple-400 border-2 p-2"
      } rounded-md border-purple-400 border-2 p-2`}
    >
      <Image
        src={themeMode === "light" ? ThemeMoon : ThemeSun}
        alt={themeMode === "light" ? "Moon" : "Sun"}
        width={20}
      />
    </Button>
  );
};
