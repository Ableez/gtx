"use client";
import React, { useEffect, useRef, useState } from "react";
import UserChatContainer from "./ChatContainer";
import MessageInput from "./message-input";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import ConversationOverMessage from "../admin/chat/ConversationOverMessage";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Props = {
  scrollToBottom: React.RefObject<HTMLDivElement>;
  chatId: string;
};

const UserChatWrapper = ({
  chatId,
  scrollToBottom,
}: Props): React.ReactElement => {
  const { conversation } = useMessagesStore();

  console.log("CRYPT CONVERSATION", conversation);
  // const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  // const docref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const el = docref.current;

  //   const scroll = () => {
  //     console.log("scrolling");
  //     if (el && window) {
  //       console.log("SCROLL TOP ell", el.scrollHeight);
  //       console.log("SCROLL TOP:", Math.round(window.scrollY));
  //       const windowScrollY = Math.floor(window.scrollY);
  //       const elScrollHeight = el.scrollHeight;
  //       const show = windowScrollY - 500 !== elScrollHeight ? true : false;
  //       console.log("SHOW", show)
  //       setIsScrolledToBottom(show);
  //     }
  //   };

  //   window?.addEventListener("scroll", scroll);

  //   return () => window?.removeEventListener("scroll", scroll);
  // });

  return (
    <div className="box-border">
      <UserChatContainer chatId={chatId} scrollToBottom={scrollToBottom} />
      {conversation?.chatStatus === "closed" ? (
        <ConversationOverMessage />
      ) : (
        <MessageInput chatId={chatId} scrollToBottom={scrollToBottom} />
      )}

      <Button
        className="fixed bottom-16 right-4 z-[49] bg-white dark:bg-black rounded-full"
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          if (scrollToBottom.current) {
            scrollToBottom.current.lastElementChild?.scrollIntoView({
              behavior: "smooth",
            });
          }
        }}
      >
        <ChevronDownIcon width={14} />
      </Button>
      {/* )} */}
    </div>
  );
};

export default UserChatWrapper;
