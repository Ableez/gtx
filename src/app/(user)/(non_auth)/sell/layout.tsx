"use client";

import SearchBar from "@/components/sellPage/SearchBar";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const SellLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const excludedPaths: RegExp[] = [/^\/sell\/.*/]; // Regex to match any subpath of /sell

  const isExcludedPath = excludedPaths.some((regex) => regex.test(pathname));

  return (
    <div>
      {!isExcludedPath && <SearchBar />}
      {children}
    </div>
  );
};

export default SellLayout;
