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
import {
  ArrowDownTrayIcon,
  ReceiptPercentIcon,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import {
  BellIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import type { User } from "../../../types";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  user?: User;
};

const ProfileButton = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {user ? (
            <Button
              className="bg-neutral-200 rounded-full"
              variant={"ghost"}
              size={"icon"}
            >
              {user.photoURL || user.imageUrl ? (
                <Image
                  src={user.photoURL || (user.imageUrl as string)}
                  width={58}
                  height={58}
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
              className="rounded-full border bg-neutral-200 dark:bg-neutral-800"
              size={"icon"}
            >
              <EllipsisVerticalIcon width={24} />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-2 z-[9999] grid">
        <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
          {user?.displayName ? user.displayName : "Username" || "NOT SIGNED IN"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div id="installContainer">
          <DropdownMenuItem
            id="installButton"
            className="py-3 w-full juxstify-start gap-2 hidden"
          >
            <ArrowDownTrayIcon width={14} />
            Install App
          </DropdownMenuItem>
        </div>

        <ToggleTheme />

        {user && (
          <DropdownMenuGroup className="">
            <Link className="py-3" href={"/transactions"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-2">
                <ReceiptPercentIcon width={14} />
                Transactions
              </DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/profile"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-2">
                <UserIconOutline width={14} />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/notification"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-2">
                <BellIcon width={14} />
                Notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <Link className="py-3" href={"/support"}>
            <DropdownMenuItem className="py-3 w-full juxstify-start gap-2">
              <InformationCircleIcon width={16} />
              Support
            </DropdownMenuItem>
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
  );
};

export default ProfileButton;
