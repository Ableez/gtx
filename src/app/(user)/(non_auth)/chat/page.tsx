import ChatCard from "@/components/admin/chat/ChatCard";
import { getUserChats } from "@/lib/utils/getUserChats";
import Link from "next/link";
import React from "react";

type Props = {};

export const dynamic = "force-dynamic";

const UserChats = async (props: Props) => {
  const chats = await getUserChats();

  if (!chats || !chats.success || !chats.data) {
    return (
      <div className="grid place-items-center justify-center align-middle gap-6 max-w-screen-md text-center mx-auto">
        <h3 className="font-bold text-lg">Chats not found</h3>
        <p className="text-xs">It may be your internet connection.</p>
        <div className="w-full">
          <Link
            className="mx-auto py-2 px-4 bg-primary rounded-md text-white font-medium"
            href={"/chat"}
          >
            Retry
          </Link>
        </div>
      </div>
    );
  }

  const renderChats = chats.data.map((chat, idx) => {
    return <ChatCard chat={chat} key={idx} idx={idx} />;
  });

  return <div className="">{renderChats}</div>;
};

export default UserChats;
