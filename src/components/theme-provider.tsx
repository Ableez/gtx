"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Registration successful", reg);
          })
          .catch((e) => {
            console.error("Error during service worker registration:", e);
            alert("sw ERROR!");
          });
      } else {
        console.warn("Service Worker is not supported");
      }
    }

    registerServiceWorker();
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
