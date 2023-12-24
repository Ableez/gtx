"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ChatIDLayout = (props: Props) => {
  const router = useRouter();
  return (
    <div className="overflow-hidden contain">
      <nav className="fixed top-0 flex align-middle justify-between place-items-center py-3 w-full z-[239] px-2 bg-neutral-100 dark:bg-neutral-800">
        <Button
          onClick={() => router.back()}
          variant={"ghost"}
          className="hover:bg-white border p-3 bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white"
        >
          <ArrowLeftIcon width={24} />
        </Button>
        {/* <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-white border p-3 bg-neutral-100  dark:bg-neutral-800 text-neutral-600 dark:text-white dark:hover:bg-neutral-700 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <p className="w-[80vw] mr-2 z-[99999999]"></p>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </nav>

      {props.children}
    </div>
  );
};

export default ChatIDLayout;
