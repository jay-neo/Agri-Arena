"use client";

import { SessionProvider } from "next-auth/react";
import { MuiThemeContextProvider } from "./mui/MuiThemeContextProvider";
import { MuiThemeProvider } from "~/components/providers/mui/MuiThemeProvider";

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <MuiThemeContextProvider>
      <MuiThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </MuiThemeProvider>
    </MuiThemeContextProvider>
  );
}
