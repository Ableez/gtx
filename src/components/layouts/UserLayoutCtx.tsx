"use client";
import SellNavbar from "@/components/sellPage/SellNavbar";
import { SunIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface UserLayoutCtxProps {
  children: ReactNode;
}

const UserLayoutCtx: React.FC<UserLayoutCtxProps> = ({ children }) => {
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  const hideNavbarRegex = /^\/chat\//;

  return (
    <div className="max-w-screen-lg mx-auto">
      {!hideNavbarRegex.test(pathName) &&
        (mounted ? (
          <SellNavbar />
        ) : (
          <div className="container py-2 backdrop-blur-lg bg-[#f5f5f56f] dark:bg-[#2222226d] z-40 flex align-middle place-items-center justify-between sticky top-0 mb-4">
            <Link
              href={"/"}
              className="flex align-middle place-items-center gap-2"
            >
              <Image
                width={36}
                height={36}
                src={"/greatexc.svg"}
                alt="Great Exchange"
                className="sticky top-0"
              />
              <h4 className="text-lg font-bold">Greatex</h4>
            </Link>
            <div className="bg-neutral-200 dark:bg-neutral-600 w-14 h-14 shadow-md rounded-full border-2 grid place-items-center align-middle text-center font-medium text-md text-opacity-20 dark:text-white leading-none border-white dark:border-neutral-500 uppercase text-base">
              <SunIcon width={22} className="animate-spin text-neutral-500" />
            </div>
          </div>
        ))}
      <div>{children}</div>
    </div>
  );
};

export default UserLayoutCtx;
