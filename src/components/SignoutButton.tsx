"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/utils/firebase";
import Cookies from "js-cookie";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { DialogClose } from "./ui/dialog";
import { postToast } from "./postToast";

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};

const SignoutButton = ({ open, setOpen }: Props) => {
  const router = useRouter();
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-w-md mx-auto text-center py-2">
        <DrawerHeader>
          <DrawerTitle className="text-center">Confirm log out</DrawerTitle>
          <DrawerDescription className="text-center">
            Live chat, and account features will stop working.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-flow-row gap-2 pb-4 px-4">
          <DialogClose
            onClick={async () => {
              await signOut(auth);
              Cookies.remove("user");
              Cookies.remove("isLoggedIn");
              postToast("Done", { description: "You have logged out" });
              router.refresh();
            }}
            className="font-semibold text-red-500 border py-3 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 border-transparent duration-300"
          >
            Logout
          </DialogClose>
          <DialogClose className="font-semibold text-neutral-500 dark:text-white border py-3 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 border-transparent duration-300">
            Cancel
          </DialogClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SignoutButton;
