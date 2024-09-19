import "~/styles/global.css";
import { meta } from "~/lib/meta";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { MuiThemeProvider } from "~/components/providers/mui/themeProvider";
import { SessionProvider } from "next-auth/react";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: meta.APP_NAME,
      template: meta.APP_TITLE_TEMPLATE,
    },
    description: meta.APP_DESCRIPTION,
    metadataBase: new URL(meta.APP_URL),
    icons: [{ url: "/logo.svg", href: "/logo.svg" }],
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: meta.APP_DEFAULT_TITLE,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: meta.APP_NAME,
      url: meta.APP_URL,
      title: {
        default: meta.APP_DEFAULT_TITLE,
        template: meta.APP_TITLE_TEMPLATE,
      },
      description: meta.APP_DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: {
        default: meta.APP_DEFAULT_TITLE,
        template: meta.APP_TITLE_TEMPLATE,
      },
      description: meta.APP_DESCRIPTION,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.className}>
      <body>
        <SessionProvider>
          <MuiThemeProvider>{children}</MuiThemeProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
