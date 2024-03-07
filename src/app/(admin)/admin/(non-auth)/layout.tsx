import AdminPathHandler from "@/lib/context/AdminPathHandler";
import AdminRedirect from "@/lib/context/AdminRedirect";
import React, { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const AdminNonAuthLayout = (props: Props) => {
  return (
    <AdminRedirect>
      <AdminPathHandler>{props.children}</AdminPathHandler>
    </AdminRedirect>
  );
};

export default AdminNonAuthLayout;
