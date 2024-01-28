"use client";

import React from "react";
import { Label } from "./ui/label";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

type Props = {};

const ToggleTheme = (props: Props) => {
  const theme = useTheme();

  return (
    <div className="py-3 px-2 transition-all duration-300 flex align-middle place-items-center justify-between">
      <Label
        className="w-full flex align-middle place-items-start justify-start gap-2 leading-5"
        htmlFor="theme"
      >
        Theme{" "}
      </Label>
      <Button
        id="theme"
        onClick={() =>
          theme.setTheme(theme.theme === "light" ? "dark" : "light")
        }
        variant="outline"
        size="icon"
        className="aspect-square hover:text-neutral-800 dark:hover:text-white"
      >
        {theme.theme === "light" ? (
          <SunIcon className="text-neutral-800 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
        ) : (
          <MoonIcon className="text-white absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        )}
      </Button>
    </div>
  );
};

export default ToggleTheme;
