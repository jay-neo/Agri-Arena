"use client";

import {
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";

interface ThemeContextType {
  toggleTheme: () => void;
  theme: Theme;
  mode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const MuiThemeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light"; // Default to "light" mode
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      document.documentElement.className = newMode === "dark" ? "dark" : "";
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.className = mode === "dark" ? "dark" : "";
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme, mode }}>
      <CssBaseline />
      <StyledEngineProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};
