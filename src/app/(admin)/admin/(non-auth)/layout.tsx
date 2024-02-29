"use client";

import AdminNavbar from "@/components/admin/Navbar";
import CloseChatDialog from "@/components/admin/chat/CloseChatDialog";
import AdminRedirect from "@/lib/context/AdminRedirect";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const AdminNonAuthLayout = (props: Props) => {
  const pathname = usePathname();
  const [confirmClose, setConfirmClose] = useState(false);

  const regex = /admin\/chat\/.*/;
  const isChatPage = regex.test(pathname);

  return (
    <AdminRedirect>
      {/* {!isChatPage ? <AdminNavbar /> : null} */}
      <AdminNavbar setConfirmClose={setConfirmClose} />
      {props.children}{" "}
      <CloseChatDialog
        confirmClose={confirmClose}
        setConfirmClose={setConfirmClose}
      />
    </AdminRedirect>
  );
};

export default AdminNonAuthLayout;
