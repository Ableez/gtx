"use client";

import { auth } from "@/lib/utils/firebase";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import React from "react";

type Props = {};

const SignOutButton = (props: Props) => {
  return (
    <div>
      <button
        onClick={async () => {
          await signOut(auth);
          Cookies.remove("user");
          Cookies.remove("verification");
        }}
        className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5 text-rose-500"
      >
        <XMarkIcon strokeWidth={2} width={18} /> <span>Sign out</span>
      </button>
    </div>
  );
};

export default SignOutButton;
