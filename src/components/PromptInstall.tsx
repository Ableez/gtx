"use client";

import {
  ArrowDownOnSquareIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

export default function PromptInstall() {
  return (
    <div
      className="banner hidden justify-center gap-4 align-middle place-items-center px-4 py-2"
      id="installContainer"
    >
      <Button id="dissmissInstall" variant={"ghost"} size={"icon"}>
        <XMarkIcon width={14} />
      </Button>
      <p>Install for better experience!</p>
      <Button
        className="flex align-middle place-items-center justify-between gap-2"
        id="installButton"
      >
        <ArrowDownTrayIcon width={18} /> Install
      </Button>
    </div>
  );
}
