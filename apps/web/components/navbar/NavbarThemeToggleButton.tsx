"use client";

import { useTheme } from "../providers/mui/MuiThemeProvider";

export const NavbarThemeToggleButton = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <div
      className={`relative inline-flex h-5 w-10 cursor-pointer rounded-full transition-colors ${
        themeMode === "light" ? "bg-gray-300" : "bg-gray-900"
      }`}
      onClick={toggleTheme}
    >
      <div
        className={`absolute left-0 top-0 h-5 w-5 rounded-full transition-transform duration-200 ease-in-out transform ${
          themeMode === "light"
            ? "translate-x-0 bg-yellow-500"
            : "translate-x-5 bg-blue-500"
        }`}
      />
    </div>
  );
};
