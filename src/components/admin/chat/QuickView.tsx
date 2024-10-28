import React from "react";
import { ConversationCollections } from "../../../../chat";
import Link from "next/link";
import useAdminConversations from "@/lib/hooks/useAdminConversations";
import ChatCard from "./ChatCard";

const QuickView = () => {
  const { allConversations } = useAdminConversations();

  const conversationsPrev = allConversations?.slice(
    0,
    3
  ) as ConversationCollections;

  const renderChats = conversationsPrev?.map((chat, idx) => {
    return <ChatCard isAdmin chat={chat} key={idx} idx={idx} />;
  });

  return (
    <div className="my-8 bg-white border dark:bg-black rounded-2xl z-40">
      <div className="dark:text-neutral-400 border-b dark:border-b-neutral-700 overflow-clip flex align-middle place-items-center justify-between p-2.5">
        <h4 className="font-semibold text-neutral-500 text-xs">
          Latest Messages
        </h4>
        <Link
          href={"/admin/chat"}
          className="py-2rounded-md text-[12px] text-secondary font-bold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800 last:rounded-b-2xl">
        {renderChats && renderChats?.length > 0 ? (
          renderChats
        ) : (
          <div className="p-6 text-center text-neutral-400 dark:text-neutral-600">
            No Chats yet
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickView;
