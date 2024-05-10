import React from "react";
import UserChatNav from "../userChatNav";
import RenderMessages from "./renderMessages";
import { useMessagesStore } from "@/lib/utils/store/userConversation";

type Props = {
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const UserChatContainer = ({ chatId, scrollToBottom }: Props) => {
  const { conversation } = useMessagesStore();

  return (
    <div className="max-w-screen-md mx-auto" ref={scrollToBottom}>
      <UserChatNav />
      <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 py-4 mt-10 mb-4 pb-10 px-8 leading-4 border-b max-w-md mx-auto">
        Secure your transaction & chat directly with our expert agents. Get
        real-time guidance, resolve issues seamlessly, & share your feedback -
        all within this chat. Let&apos;s make your transaction smooth &
        hassle-free!
      </p>
      {conversation ? (
        <RenderMessages
          scrollToBottom={scrollToBottom}
          card={conversation?.transaction?.cardDetails}
          data={conversation}
          chatId={chatId}
        />
      ) : (
        <div className="text-center p-8 dark:text-opacity-40">
          Loading Messages...
        </div>
      )}
      <div className="h-28" />
    </div>
  );
};

export default UserChatContainer;
