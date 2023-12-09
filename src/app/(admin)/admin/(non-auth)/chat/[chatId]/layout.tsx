import ChatNavDropdown from "@/components/admin/ChatNavDropdown";
import { useRouter } from "next/navigation";
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
