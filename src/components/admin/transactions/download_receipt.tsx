import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

const DownloadReceipt = (props: Props) => {
  return (
    <div className="w-full grid gap-2 align-middle place-items-center justify-center">
      <Button disabled={true} aria-disabled="true">
        Download
      </Button>
      <p className="text-xs text-neutral-400 italic">Coming soon...</p>
    </div>
  );
};

export default DownloadReceipt;
