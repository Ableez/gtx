import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/sonner";
import NetworkMonitor from "../lib/context/NetworkMonitor";

const openSans = Open_Sans({ subsets: ["latin"] });

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
      <body className={`bg-[#f5f5f5] dark:bg-[#222] ${openSans.className}`}>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
