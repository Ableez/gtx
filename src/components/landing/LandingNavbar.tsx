"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Bars3Icon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { auth } from "@/lib/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
    // Cleanup
    return () => unsubscribe();
  }, [router]);

  return (
    <NavigationMenu className="bg-white dark:bg-neutral-700 dark:bg-opacity-50 py-3 md:px-16 sticky top-0 container">
      <button
        className="py-3.5 pr-3 duration-300 active:skew-x-12 rounded-full md:hidden flex absolute top-1"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bars3Icon width={25} />
      </button>
      <Link
        href={"/"}
        className="flex align-middle place-items-center gap-2 mx-auto md:mx-0"
      >
        <Image
          width={38}
          height={38}
          src={"greatexc.svg"}
          alt="Great Exchange"
        />
        <h4 className="text-xl font-bold">Greatexc</h4>
      </Link>

      <NavigationMenuList className="hidden sm:flex">
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
        className={`h-screen duration-200 w-screen bg-black bg-opacity-10 backdrop-blur-sm fixed top-0 ${
          open ? "opacity-100 block" : "opacity-0 hidden"
        }`}
      ></div>
      <div
        className={`h-screen ease-out duration-500 md:w-72 w-[100vw] bg-white dark:bg-[#222] fixed top-0 ${
          open ? "left-0" : "-left-[150vw] grid place-items-center"
        }`}
      >
        <div className="h-screen">
          <div className="flex align-middle place-items-center gap-1 p-4 w-fit">
            <Image
              width={38}
              height={38}
              src={"greatexc.svg"}
              alt="Great Exchange"
            />
            <h4 className="text-xl font-bold">Greatexc</h4>
          </div>

          <Button
            onClick={() => setOpen(false)}
            variant={"outline"}
            className="p-4 absolute top-3 right-3 dark:hover:text-neutral-300 hover:text-neutral-800"
          >
            <XMarkIcon width={24} />
          </Button>
          <ul className=" grid grid-flow-row place-items-start gap-2 p-4">
            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-700 px-5 p-3"
              href={"/sell"}
            >
              <li>Gift cards</li>
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-700 px-5 p-3"
              href={"/sell"}
            >
              <li>Crypto currencies</li>
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-700 px-5 p-3"
              href={""}
            >
              <li>About Us</li>
            </Link>

            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-700 px-5 p-3"
              href={"/"}
            >
              <li>Policies</li>
            </Link>

            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full hover:bg-neutral-100 duration-200 dark:hover:bg-neutral-700 px-5 p-3"
              href={"/login"}
            >
              <li>Login</li>
            </Link>
          </ul>
          <div className="fixed bottom-0 w-full grid place-items-center p-4">
            <Link
              onClick={() => setOpen(false)}
              className="rounded-2xl w-full text-center bg-primary hover:bg-primary hover:bg-opacity-70 px-5 p-3 text-white font-bold"
              href={"/sell"}
            >
              Sell
            </Link>
          </div>
        </div>
      </div>
    </NavigationMenu>
  );
}
