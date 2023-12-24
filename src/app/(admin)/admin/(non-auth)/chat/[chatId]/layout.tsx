import ChatNavDropdown from "@/components/admin/ChatNavDropdown";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminChatIDLayout = (props: Props) => {
  return (
    <div className="overflow-hidden contain">
      <ChatNavDropdown />
      {props.children}
    </div>
  );
};

export default AdminChatIDLayout;
