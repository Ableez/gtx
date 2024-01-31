import ChatNavDropdown from "@/components/admin/ChatNavDropdown";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminChatIDLayout = (props: Props) => {
  return <>{props.children}</>;
};

export default AdminChatIDLayout;
