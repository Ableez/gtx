"use client";

import { Banner, BannerCollapseButton } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { Button } from "./ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function PromptInstall() {
  const [mount, setMount] = useState(false)
  
  useEffect(() => {
    setMount(true)
  }, [])

  if (!mount) return null;

  return (
    <Banner className="bg-neutral-400" id="installContainer">
      <div
        id="installContainer"
        className="bg-purple-300 font-medium text-[14px] dark:from-purple-500/10 dark:to-pink-600/30 bg-gradient-to-r dark:bg-black text-black flex align-middle place-items-center justify-between"
      >
        <BannerCollapseButton className="aspect-square bg-black/30 rounded-full grid place-items-center p-0 h-8 w-8 ml-2">
          <HiX className="h-4 w-4" />
        </BannerCollapseButton>

        <div className="p-2 flex align-middle place-items-center justify-between sticky top-0 max-w-md w-full mx-auto">
          <h4 className="text-sm">Install Greatex to your device</h4>
          <Button id={"installButton"} className="flex gap-1">
            <ArrowDownTrayIcon width={16} /> Install
          </Button>
        </div>
      </div>
    </Banner>
  );
}
