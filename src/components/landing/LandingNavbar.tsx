"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Cookies from "js-cookie";
import { User } from "firebase/auth";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const cachedUser = Cookies.get("user");
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  return (
    <div className="bg-white bg-opacity-80 dark:bg-neutral-800 dark:bg-opacity-70 backdrop-blur-md border-b border-b-neutral-100 dark:border-neutral-700 py-3 sticky top-0 z-[99999]">
      <NavigationMenu className="max-w-screen-lg mx-auto relative">
        <button
          title="open side menu"
          className="pl-4 duration-300 rounded-full md:hidden flex absolute"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Bars3Icon width={25} />
        </button>
        <Link
          href={"/"}
          className="flex align-middle place-items-center gap-2 mx-auto md:mx-0"
        >
          <Image
            width={25}
            height={25}
            src={"/greatexc.svg"}
            alt="Great Exchange"
          />
          <h4 className="text-lg font-bold">Greatexc</h4>
        </Link>

        <NavigationMenuList className="hidden md:flex">
          <Link
            href="/"
            className="bg-transparent p-2 border border-transparent transition-colors duration-300 rounded-2xl px-6 dark:hover:bg-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            Services
          </Link>
          <Link
            href="/"
            className="bg-transparent p-2 border border-transparent transition-colors duration-300 rounded-2xl px-6 dark:hover:bg-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            About Us
          </Link>
          <Link
            href="/"
            className="bg-transparent p-2 border border-transparent transition-colors duration-300 rounded-2xl px-6 dark:hover:bg-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            Policies
          </Link>
        </NavigationMenuList>

        {user ? (
          <Link className="sm:flex hidden" href="/sell">
            <Button className="px-10 rounded-2xl">Sell</Button>
          </Link>
        ) : (
          <Link className="sm:flex hidden" href="/login">
            <Button className="px-10 rounded-2xl">Login</Button>
          </Link>
        )}

        <div
          onClick={() => setOpen(false)}
          className={`h-screen duration-200 bg-black bg-opacity-10 backdrop-blur-sm fixed top-0 ${
            open ? "opacity-100 block" : "opacity-0 hidden"
          }`}
        ></div>
        <div
          className={`h-screen overflow-hidden ease-out duration-500 w-full bg-white dark:bg-[#222] fixed top-0 ${
            open ? "left-0" : "-left-[150vw] grid place-items-center"
          }`}
        >
          <div className="h-full first-letter:overflow-hidden">
            <div className="flex align-middle place-items-center gap-2 p-4 w-fit">
              <Image
                width={25}
                height={25}
                src={"/greatexc.svg"}
                alt="Great Exchange"
              />
              <h4 className="text-xl font-bold">Greatexc</h4>
            </div>

            <Button
              onClick={() => setOpen(false)}
              variant={"outline"}
              className="p-4 absolute top-3 right-3 dark:hover:text-neutral-300 hover:text-neutral-800"
            >
              <XMarkIcon width={20} />
            </Button>

            <ul className="grid grid-flow-row place-items-start gap-2 p-4">
              <Link
                onClick={() => setOpen(false)}
                className="rounded-2xl w-full bg-primary duration-200 group px-3 py-2.5 flex align-middle place-items-center justify-between"
                href={"/sell"}
              >
                <li>Sell a Gift card</li>
                <CurrencyDollarIcon
                  width={22}
                  className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                  color="white"
                />
              </Link>
              <Link
                onClick={() => setOpen(false)}
                className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-800 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                href={"/sell"}
              >
                <li>Crypto currencies</li>
                <ChevronRightIcon
                  width={14}
                  className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                  color="white"
                />
              </Link>
              <Link
                onClick={() => setOpen(false)}
                className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-800 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                href={""}
              >
                <li>About Us</li>
                <ChevronRightIcon
                  width={14}
                  className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                  color="white"
                />
              </Link>

              <Link
                onClick={() => setOpen(false)}
                className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-800 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                href={"/"}
              >
                <li>Policies</li>
                <ChevronRightIcon
                  width={14}
                  className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                  color="white"
                />
              </Link>

              <Link
                onClick={() => setOpen(false)}
                className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-800 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                href={"/login"}
              >
                <li>Login</li>
                <ChevronRightIcon
                  width={14}
                  className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                  color="white"
                />
              </Link>
            </ul>
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
}
