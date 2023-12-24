"use client";

import SellNavbar from "@/components/sellPage/SellNavbar";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  const pathname = usePathname();

  const chatReg = /^\/chat\/.*/;
  const transactionsReg = /^\/transactions/;
  const isChatPage = chatReg.test(pathname);
  const isTransactionsPage = transactionsReg.test(pathname);

  return (
    <div className="max-w-screen-lg mx-auto">
      {isChatPage || isTransactionsPage ? null : <SellNavbar />}
      {props.children}
    </div>
  );
};

export default UserLayout;
