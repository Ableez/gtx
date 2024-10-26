import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { SunIcon } from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import { postToast } from "../postToast";
import AttachFile from "./AttachFile";
import type { Conversation } from "../../../chat";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import Cookies from "js-cookie";
import { Timestamp } from "firebase/firestore";
import { v4 } from "uuid";

type Props = {
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const MessageInput = ({ chatId, scrollToBottom }: Props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateConversation, conversation } = useMessagesStore();

  const formRef = useRef<HTMLFormElement>(null);

  const formAction = (e: FormData) => {
    if (message.length === 0) return;

    console.log("SENDING MESSAGE");

    sendMessageAction(e).then((res) => {
      if (!res?.success) {
        postToast(res?.message.toString() || "An error occured");
      }
    });
  };

  // Create a function to send a user message
  const sendMessageAction = sendUserMessage.bind(null, chatId);

  const submitForm = async () => {
    setMessage("");
    setLoading(true);

    const msg = {
      id: v4(),
      timeStamp: new Date(), // replaced_date,
    };

    const newMessage = {
      id: msg.id,
      type: "text",
      deleted: false,
      timeStamp: new Date(), // replaced_date,
      sender: {
        username: user.displayName,
        uid: user.uid,
      },
      recipient: "admin",
      content: {
        text: message,
        media: { text: message },
      },
      read_receipt: {
        delivery_status: "not_sent",
        status: false,
        time: new Date(), // date_replaced,
      },
      quoted_message: null,
      deleted_at: undefined,
      updated_at: new Date(), // replaced_date,
    };

    updateConversation(
      {
        ...conversation,
        id: conversation?.id || "",
        messages: [...(conversation?.messages || []), newMessage],
      } as Conversation,
      scrollToBottom
    );

    if (scrollToBottom.current?.lastElementChild) {
      scrollToBottom.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-neutral-50 dark:bg-black w-screen py-2 border px-2 shadow-xl fixed bottom-0 translate-x-1/2 -left-1/2">
      <form
        ref={formRef}
        onSubmit={() => submitForm()}
        action={async (e: FormData) => formAction(e)}
        className="grid grid-cols-12 grid-flow-col gap-1 align-middle place-items-center justify-between max-w-xl mx-auto"
      >
        <AttachFile
          scrollToBottom={scrollToBottom}
          chatId={chatId}
          message={conversation}
        />

        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoCorrect="true"
          autoComplete="off"
          className={`transition-all duration-300 bg-neutral-200 dark:bg-black resize-none leading-4 text-sm focus:outline-none col-span-9 md:col-span-10 w-full p-3 rounded-xl scroll`}
          placeholder="Enter a message..."
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />

        <button
          disabled={loading || message.length === 0}
          type="submit"
          className="focus:outline-none col-span-2 md:col-span-1 border-secondary rounded-xl duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary disabled:bg-pink-400 text-white"
          title={loading ? "Sending..." : "Send Message"}
        >
          {loading ? (
            <SunIcon className="animate-spin duration-1000 text-xl" />
          ) : (
            <PaperAirplaneIcon width={25} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
