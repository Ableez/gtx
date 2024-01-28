"use client";

import AdminNavbar from "@/components/admin/Navbar";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ADMINNONAUTHLAYOUT = (props: Props) => {
  const pathname = usePathname();

  const regex = /admin\/chat\/.*/;
  const isChatPage = regex.test(pathname);

  return (
    <div>
      {!isChatPage ? <AdminNavbar /> : null}
      {props.children}
    </div>
  );
};

export default ADMINNONAUTHLAYOUT;
