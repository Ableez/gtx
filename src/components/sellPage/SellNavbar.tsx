/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import SignoutButton from "../SignoutButton";
import ToggleTheme from "../toggleTheme";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import Image from "next/image";
import BackButton from "./BackButton";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User } from "../../../types";

type Props = {
  pageTitle: String;
};

export default function SellNavbar({ pageTitle }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCached = Cookies.get("user");
    if (userCached) {
      setUser(JSON.parse(userCached));
    }
  }, []);

  if (!user) {
    return <div className="p-6" />;
  }

  return (
    <>
      <div className="max-w-screen-md mx-auto py-1.5 backdrop-blur-sm bg-[#f5f5f56f] dark:bg-[#2222226d] z-40 flex align-middle place-items-center justify-between sticky top-0 mb-4 px-4">
        {pageTitle === "sell" ? (
          <Link
            href={"/"}
            className="flex align-middle place-items-center gap-2"
          >
            <Image
              width={30}
              height={30}
              src={"/greatexc.svg"}
              alt="Great Exchange"
              className="sticky top-0"
            />
            <h4 className="text-lg font-bold text-primary">Greatex</h4>
          </Link>
        ) : (
          <BackButton />
        )}
        <h4 className="text-lg font-bold capitalize">{pageTitle}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-neutral-200 dark:bg-neutral-600 aspect-square w-12 h-12 shadow-md rounded-full border-2 grid place-items-center align-middle text-center font-medium text-md text-opacity-20 dark:text-white leading-none border-white dark:border-neutral-500 uppercase text-base">
              {user ? (
                <Image
                  src={user.photoURL || "/logoplace.svg"}
                  width={55}
                  height={55}
                  alt={user.displayName}
                  priority
                  className="w-full rounded-full aspect-square object-cover text-[10px]"
                />
              ) : (
                <Button
                  asChild
                  variant={"ghost"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <EllipsisVerticalIcon width={18} />
                </Button>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2 z-[9999] grid">
            <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
              {user.displayName || "NOT SIGNED IN"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ToggleTheme />

            {user && (
              <DropdownMenuGroup>
                <Link className="py-3" href={"/transactions"}>
                  <DropdownMenuItem className="py-3">
                    Transactions
                  </DropdownMenuItem>
                </Link>
                <Link className="py-3" href={"/profile"}>
                  <DropdownMenuItem className="py-3">Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}
            <DropdownMenuGroup>
              <Link className="py-3" href={"/support"}>
                <DropdownMenuItem className="py-3">Support</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {user ? (
              <SignoutButton />
            ) : (
              <Link href={"/login"}>
                <DropdownMenuItem className="w-full px-3 py-2 rounded-md flex align-middle place-items-center justify-between text-rose-600 border border-rose-600/20 bg-rose-50 hover:bg-rose-100 font-semibold dark:bg-red-500 dark:hover:bg-red-400 dark:bg-opacity-10 duration-150">
                  Login
                  <ArrowRightOnRectangleIcon width={20} />
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
