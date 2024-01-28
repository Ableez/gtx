"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/utils/firebase";
import Cookies from "js-cookie";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

type Props = {};

const SignoutButton = (props: Props) => {
  const router = useRouter();
  return (
    <Button
      variant={"ghost"}
      onClick={async () => {
        await signOut(auth);
        Cookies.remove("user");
        Cookies.remove("isLoggedIn");
        router.refresh();
      }}
      className="w-full py-3 flex align-middle place-items-center justify-between text-primary border border-primary bg-pink-100 font-semibold dark:bg-pink-500 dark:bg-opacity-10"
    >
      Logout
      <ArrowLeftOnRectangleIcon width={20} className="-scale-x-100" />
    </Button>
  );
};

export default SignoutButton;
