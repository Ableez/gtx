"use client";
import Link from "next/link";
import Image from "next/image";
import { NavigationMenu } from "@/components/ui/navigation-menu";
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
  ArrowLeftIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import { SetStateAction, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/utils/firebase";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useAdminUser } from "@/lib/utils/adminActions/useAdminUser";

type Props = {
  setConfirmClose: React.Dispatch<SetStateAction<boolean>>;
};

export default function AdminNavbar({ setConfirmClose }: Props) {
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const user = useAdminUser();

  useEffect(() => {
    if (pathName == "/admin") {
      setPageTitle("Dashboard");
    } else if (pathName.split("/")[2] === "chat") {
      setPageTitle("Chat");
    } else if (pathName.split("/")[2] === "transactions") {
      setPageTitle("Transactions");
    } else if (pathName.split("/")[2] === "reports") {
      setPageTitle("Reports");
    }
  }, [pathName]);

  return (
    <div className="px-2 py-2 mb-4 backdrop-blur-md dark:backdrop-blur-lg sticky top-0 shadow-lg shadow-[#ffacf323] dark:shadow-[#24182a23] bg-[#f5f5f5c0] dark:bg-[#222222db] z-50 max-w-screen-md mx-auto">
      <NavigationMenu>
        {pathName === "/admin" ? (
          <Link href={"/"} className="p-3">
            <Image
              src={"/greatexc.svg"}
              alt={"Great Exchange logo"}
              width={30}
              height={30}
            />
          </Link>
        ) : (
          <Button onClick={() => router.back()} variant={"ghost"} size={"icon"}>
            <ArrowLeftIcon width={22} />
          </Button>
        )}

        <h4 className="text-lg font-bold">{pageTitle}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <EllipsisVerticalIcon width={22} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2 z-[9999] grid">
            <DropdownMenuLabel>
              <h4 className="text-sm">
                Howdy,{" "}
                <span className="capitalize">
                  {user?.displayName || "Admin"}
                </span>
              </h4>
              <h6 className="text-neutral-500 text-[0.7em]">
                You are an admin
              </h6>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/\/admin\/chat\/(.*)$/.test(pathName) ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setConfirmClose(true);
                    }}
                    asChild
                  >
                    <Button variant={"ghost"} className="w-full py-3 text-left">
                      Close chat
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              </>
            ) : (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="py-3">
                    Transactions History
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3">
                    Contact Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>

                <DropdownMenuGroup>
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
                <DropdownMenuItem
                  onClick={() => {
                    signOut(auth);
                    Cookies.remove("user");
                    Cookies.remove("state");
                    router.refresh();
                    router.replace("/admin/login");
                  }}
                  className="w-full py-3 flex align-middle place-items-center justify-between text-primary border border-primary bg-pink-100 font-semibold dark:bg-pink-500 dark:bg-opacity-10"
                >
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenu>
    </div>
  );
}
