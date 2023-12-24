"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import { useContext, useEffect, useState } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "@/lib/utils/firebase";
import { redirect, usePathname } from "next/navigation";
import { AuthContext } from "@/lib/context/AuthProvider";

export default function SellNavbar() {
  const { setTheme } = useTheme();
  const user = useContext(AuthContext);

  return (
    <div className="container pb-3 py-4 backdrop-blur-lg bg-[#f5f5f56f] dark:bg-[#2222226d] z-[999]">
      <NavigationMenu>
        <Link href={"/"} className="flex align-middle place-items-center gap-2">
          <Image
            width={36}
            height={36}
            src={"/greatexc.svg"}
            alt="Great Exchange"
            className="sticky top-0"
          />
          <h4 className="text-lg font-bold">
            Great Exchange
          </h4>
        </Link>
        <NavigationMenuList className="hidden md:visible">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sell
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Policies
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300  active:from-stone-500 shadow-primary"></div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2 z-[9999] grid">
            <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
              {auth.currentUser?.displayName || "Not Logged in"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link className="py-3" href={"/transactions"}>
                <DropdownMenuItem>Your Transactions</DropdownMenuItem>
              </Link>
              <Link className="py-3" href={"/support"}>
                <DropdownMenuItem className="py-3">Support</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <Link className="py-3" href={"/profile"}>
                <DropdownMenuItem className="py-3">Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="py-3">
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className="flex align-middle justify-between place-items-center py-3"
                      onClick={() => setTheme("light")}
                    >
                      Light
                      <SunIcon width={20} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex align-middle justify-between place-items-center py-3"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                      <MoonIcon width={20} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex align-middle justify-between place-items-center py-3"
                      onClick={() => setTheme("system")}
                    >
                      System
                      <ComputerDesktopIcon width={20} />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem
                onClick={() => {
                  signOut(auth);
                  redirect("/");
                }}
                className="py-3 flex align-middle place-items-center justify-between text-red-500 font-semibold"
              >
                Log out
                <ArrowLeftOnRectangleIcon width={20} />
              </DropdownMenuItem>
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
      </NavigationMenu>
    </div>
  );
}
