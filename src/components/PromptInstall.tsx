"use client";

import React, { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription } from "./ui/drawer";
import { Button } from "./ui/button";

type Props = {};

const PromptInstall = (props: Props) => {
  //   let eventPrompt = useRef<Event>(null);
  const [open, setOpen] = useState(false);
  const installButton = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window) {
      let eventPrompt: Event | null = null;

      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        alert("install pwa");
        eventPrompt = event;
      });

      installButton.current?.addEventListener("click", async () => {
        if (!eventPrompt) {
          return;
        }
        const result = await eventPrompt?.prompt();
        console.log(`Install prompt was: ${result.outcome}`);
        disableInAppEventPrompt();
      });
    }
  }, []);

  function disableInAppEventPrompt() {
    setOpen(false);
  }

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <DrawerDescription>nstall Greatex on to your devic</DrawerDescription>
        <Button ref={installButton}>Install</Button>
      </DrawerContent>
    </Drawer>
  );
};

export default PromptInstall;
