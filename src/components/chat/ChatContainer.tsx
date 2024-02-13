import React from "react";
import UserChatNav from "../userChatNav";
import RenderMessages from "./renderMessages";

type Props = {
  allMessages: any;
  scrollToBottom: any;
  id: any;
};

const UserChatContainer = ({allMessages, id, scrollToBottom}: Props) => {
  return (
    <div className="h-[100vh] overflow-y-scroll">
      <UserChatNav data={allMessages} />
      <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 py-4 mt-10 pb-10 px-8 leading-4 border-b">
        Secure your transaction & chat directly with our expert agents. Get
        real-time guidance, resolve issues seamlessly, & share your feedback -
        all within this chat. Let&apos;s make your transaction smooth &
        hassle-free!
      </p>
      <div>
        {allMessages ? (
          <RenderMessages
            card={allMessages?.transaction?.cardDetails}
            scrollToBottom={scrollToBottom}
            data={allMessages}
            id={id}
          />
        ) : (
          <div className="text-center p-8 dark:text-opacity-40">
            Loading Messages...
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChatContainer;
