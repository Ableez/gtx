import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/lib/context/AuthProvider";
import { Suspense } from "react";
import Loading from "./loading";
// import { Toast } from "@/components/ui/toast";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Great Exchange",
  description: "Greate exchange is a giftcard exchange company, we buy your giftcards at high rates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-[#f5f5f5] dark:bg-[#222] ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
