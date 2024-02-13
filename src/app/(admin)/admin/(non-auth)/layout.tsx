"use client";

import AdminNavbar from "@/components/admin/Navbar";
import CloseChatDialog from "@/components/admin/chat/CloseChatDialog";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const ADMINNONAUTHLAYOUT = (props: Props) => {
  const pathname = usePathname();
  const [confirmClose, setConfirmClose] = useState(false);

  const regex = /admin\/chat\/.*/;
  const isChatPage = regex.test(pathname);

  return (
    <div>
      {/* {!isChatPage ? <AdminNavbar /> : null} */}
      <AdminNavbar setConfirmClose={setConfirmClose} />
      {props.children}

      <CloseChatDialog
        confirmClose={confirmClose}
        setConfirmClose={setConfirmClose}
      />
    </div>
  );
};

export default ADMINNONAUTHLAYOUT;
