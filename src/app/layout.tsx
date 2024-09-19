import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NotificationWrapper from "@/lib/context/PushNotificationWrapper";

const openSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Great Exchange",
  description:
    "Great exchange is a giftcard exchange company, we buy your giftcards at high rates.",
  creator: "Ahmed Abdullahi (Ableez)",
  authors: [
    {
      name: "Ahmed Abdullahi",
      url: "https://github.com/ableez",
    },
    {
      name: "Ahmed Abdullahi",
      url: "https://instagram.com/ableezz",
    },
    {
      name: "Ahmed Abdullahi",
      url: "https://twitter.com/Ableezz",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className={`bg-[#f5f5f5] dark:bg-black ${openSans.className}`}>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <Suspense fallback={<Loading />}>
            <NotificationWrapper>{children}</NotificationWrapper>

            {/* <PromptInstall /> */}
          </Suspense>
        </ThemeProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}

const Head = () => {
  return (
    <head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=yes, user-scalable=no, viewport-fit=cover"
      />
      <meta name="application-name" content="Greatex" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Greatex" />
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={"use-credentials"}
      ></link>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      ></link>
      <link
        rel="icon"
        type="image/x-icon"
        href="/icons/maskable_icon_x192.png"
      ></link>
      <meta
        name="description"
        content="Welcome to Great Exchange, where turning your unwanted gift cards into instant cash is as easy as a few clicks! Say goodbye to the hassle of holding onto gift cards you'll never use. With Great Exchange, you can seamlessly exchange any type of gift card for cash, instantly. Whether it's from your favorite clothing store, a popular restaurant, or even a niche boutique, we've got you covered. Unlock the value of those forgotten gift cards today with Great Exchange, your go-to platform for fast and convenient cash exchanges!"
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-tap-highlight" content="no" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/icons/maskable_icon_x192.png" />
      {/* <Script src="../../install-pwa.js" /> */}
    </head>
  );
};
