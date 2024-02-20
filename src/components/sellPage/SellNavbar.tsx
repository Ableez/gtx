/* eslint-disable @next/next/no-img-element */
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
import { User } from "firebase/auth";
import SignoutButton from "../SignoutButton";
import ToggleTheme from "../toggleTheme";
import Cookies from "js-cookie";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";

export default function SellNavbar() {
  const cookieUser = Cookies.get("user");
  const userCreds = JSON.parse(cookieUser || "{}") as User;

  const user =
    userCreds?.providerData?.length > 0
      ? userCreds?.providerData[0]
      : userCreds;

  return (
    <div className="container py-2 backdrop-blur-lg bg-[#f5f5f56f] dark:bg-[#2222226d] z-40 flex align-middle place-items-center justify-between sticky top-0 mb-4">
      <Link href={"/"} className="flex align-middle place-items-center gap-2">
        <img
          width={34}
          height={34}
          src={"/greatexc.svg"}
          alt="Great Exchange"
          className="sticky top-0"
        />
        <h4 className="text-lg font-bold">Greatex</h4>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user?.uid && user?.displayName?.charAt(0) ? (
            <div className="bg-neutral-200 dark:bg-neutral-600 w-12 h-12 shadow-md rounded-full border-2 grid place-items-center align-middle text-center font-medium text-md text-opacity-20 dark:text-white leading-none border-white dark:border-neutral-500 uppercase text-base">
              {user?.uid && user?.displayName?.charAt(0)}
            </div>
          ) : (
            <Button variant={"ghost"} className="rounded-full" size={"icon"}>
              <EllipsisVerticalIcon width={24} />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-2 z-[9999] grid">
          <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
            {user?.displayName || "NOT SIGNED IN"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user?.uid && (
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
            <ToggleTheme />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {user?.uid ? (
            <>
              <SignoutButton />
            </>
          ) : (
            <Link href={"/login"}>
              <DropdownMenuItem className="py-3 flex align-middle place-items-center justify-between bg-primary text-white font-semibold">
                Login
                <ArrowRightOnRectangleIcon width={20} />
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
