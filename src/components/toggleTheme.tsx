"use client";

import React from "react";
import { Label } from "./ui/label";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Switch } from "./ui/switch";

type Props = {};

const ToggleTheme = (props: Props) => {
  const theme = useTheme();

  return (
    <button
      id="theme"
      onClick={() => theme.setTheme(theme.theme === "light" ? "dark" : "light")}
      className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5"
    >
      <div>
        {theme.theme === "light" ? (
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        ) : (
          <MoonIcon className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        )}
      </div>
      <Label
        className="w-full flex align-middle place-items-start justify-start gap-1"
        htmlFor="theme"
      >
        <span className="capitalize">{theme.theme}</span>
        <span>mode</span>
      </Label>
      <Switch
        id="theme"
        checked={theme.theme === "dark"}
        onCheckedChange={() =>
          theme.setTheme(theme.theme === "dark" ? "light" : "dark")
        }
      />
    </button>
  );
};

export default ToggleTheme;
