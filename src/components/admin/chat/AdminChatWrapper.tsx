"use client";
import React from "react";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import AdminChatContainer from "./AdminChatContainer";
import ConversationOverMessage from "./ConversationOverMessage";
import AdminMessageInput from "./AdminMessageInput";

type Props = {
  scrollToBottom: React.RefObject<HTMLDivElement>;
  chatId: string;
};

const AdminChatWrapper = ({ chatId, scrollToBottom }: Props) => {
  const { conversation } = adminCurrConversationStore();

  return (
    <div className="box-border overflow-clip">
      <AdminChatContainer chatId={chatId} scrollToBottom={scrollToBottom} />
      {conversation?.chatStatus === "closed" ? (
        <ConversationOverMessage admin chatId={chatId} />
      ) : (
        <AdminMessageInput chatId={chatId} scrollToBottom={scrollToBottom} />
      )}
    </div>
  );
};

export default AdminChatWrapper;
