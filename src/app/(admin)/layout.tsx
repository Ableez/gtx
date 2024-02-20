import AdminLayoutProtect from "@/lib/context/AdminRedirect";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const AdminLayout = (props: Props) => {
  return <AdminLayoutProtect>{props.children}</AdminLayoutProtect>;
};

export default AdminLayout;
