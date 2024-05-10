import React from "react";
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
import { UserIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { User } from "../../../types";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  user: User;
};

const ProfileButton = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {user ? (
            <Button variant={"ghost"} size={"icon"}>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  width={55}
                  height={55}
                  alt={user?.displayName}
                  priority
                  className="w-full rounded-full aspect-square object-cover text-[10px]"
                />
              ) : (
                <UserIcon
                  width={20}
                  className="text-neutral-400 dark:text-white"
                />
              )}
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              className="rounded-full border"
              size={"icon"}
            >
              <EllipsisVerticalIcon width={24} />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-2 z-[9999] grid">
        <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
          {user?.displayName || "NOT SIGNED IN"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ToggleTheme />

        {user && (
          <DropdownMenuGroup className="">
            <Link className="py-3" href={"/transactions"}>
              <DropdownMenuItem className="py-3">Transactions</DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/profile"}>
              <DropdownMenuItem className="py-3">Profile</DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/profile"}>
              <DropdownMenuItem className="py-3">
                Notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <Link className="py-3" href={"/support"}>
            <DropdownMenuItem className="py-3">Support</DropdownMenuItem>
          </Link>
          <Button variant={"ghost"} className="py-3" asChild>
            <DropdownMenuItem className="py-3">Install App</DropdownMenuItem>
          </Button>
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
  );
};

export default ProfileButton;
