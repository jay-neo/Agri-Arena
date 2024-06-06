"use client";

import { ThemeContextProvider } from "./mui-theme-context-provider";
// import { ThemeProvider } from "./next-theme-provider";
// import { TRPCProvider } from "./trpc-provider";
// import { ModalProvider } from "./modal-provider";

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    //   <TRPCProvider>
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="system"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    <ThemeContextProvider>{children}</ThemeContextProvider>
    //   {/* <ModalProvider /> */}
    // {/* </ThemeProvider> */}
    // {/* //   </TRPCProvider> */}
  );
}
