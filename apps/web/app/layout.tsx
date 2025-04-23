import "~/styles/global.css";
import { meta } from "~/lib/meta";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "~/components/sonner";
import { Providers } from "~/components/providers";

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
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
