"use client";

import SellNavbar from "@/components/sellPage/SellNavbar";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  const pathname = usePathname();

  const regex = /^\/chat\/.*/;
  const isChatPage = regex.test(pathname)


  return (
    <div className="max-w-screen-lg mx-auto">
      {!isChatPage ? <SellNavbar /> : null}
      {props.children}
    </div>
  );
};

export default UserLayout;
