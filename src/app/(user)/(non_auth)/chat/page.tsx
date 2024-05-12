import ChatCard from "@/components/admin/chat/ChatCard";
import { Button } from "@/components/ui/button";
import { getUserChats } from "@/lib/utils/getUserChats";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {};

export const dynamic = "force-dynamic";

const UserChats = async (props: Props) => {
  const chats = await getUserChats();

  if (
    !chats ||
    !chats.success ||
    !chats.data ||
    (chats.success && chats.data?.length === 0)
  ) {
    return (
      <div className="h-[100dvh] grid place-items-start py-16 justify-center">
        <div className="grid place-items-center justify-center align-middle gap-6 max-w-screen-md text-center mx-auto">
          <h3 className="font-bold text-xl">Chats not found</h3>
          <p className="text-xs">
            Check your internet connection and try again
          </p>
          <Button className="flex align-middle place-items-center gap-2">
            <ReloadIcon /> Retry
          </Button>
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
