import { postToast } from "@/components/postToast";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import { PaperAirplaneIcon, SunIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import AdminAttachFile from "./AdminAttachFile";
import type { Conversation } from "../../../../chat";
import { v4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import Cookies from "js-cookie";

type Props = {
  scrollToBottom: React.RefObject<HTMLDivElement>;
  chatId: string;
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const AdminMessageInput = ({ chatId, scrollToBottom }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { conversation, updateConversation } = adminCurrConversationStore();

  const sendMessageAction = sendAdminMessage.bind(
    null,
    { timeStamp: new Date() },
    chatId,
    conversation?.user as {
      username: string;
      uid: string;
      email: string;
      photoUrl: string;
    }
  );

  const formAction = (e: FormData) => {
    if (message.length === 0) return;
    setLoading(true);

    sendMessageAction(e).then((res) => {
      if (res?.error) {
        postToast("Not sent!", {
          description: "Previous message not sent. Please try again.",
        });
      }
      setLoading(false);
    });
  };

  const submitForm = async () => {
    setMessage("");

    const msg = {
      id: v4(),
      timeStamp: Timestamp.fromDate(new Date()),
    };
    const newMessage = {
      id: msg.id,
      type: "text",
      deleted: false,
      timeStamp: Timestamp.fromDate(new Date()),
      sender: {
        username: user.displayName,
        uid: user.uid,
      },
      recipient: "user",
      content: {
        text: message,
        media: { text: message },
      },
      read_receipt: {
        delivery_status: "not_sent",
        status: false,
        time: msg.timeStamp,
      },
      quoted_message: null,
      deleted_at: undefined,
    };

    updateConversation({
      ...conversation,
      id: conversation?.id || "",
      messages: [...(conversation?.messages || []), newMessage],
    } as Conversation);

    if (scrollToBottom.current?.lastElementChild) {
      scrollToBottom.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  return (
    <div className="bg-neutral-50 left-1/2 -translate-x-1/2 dark:bg-black fixed bottom-0 w-screen py-2 pb-4 border px-2 shadow-xl">
      <form
        ref={formRef}
        onSubmit={() => submitForm()}
        action={async (e: FormData) => formAction(e)}
        className="grid grid-cols-12 grid-flow-col gap-1 align-middle place-items-center justify-between max-w-xl mx-auto"
      >
        <AdminAttachFile
          scrollToBottom={scrollToBottom}
          chatId={chatId}
          message={conversation}
        />

        <input
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoCorrect="true"
          autoComplete="off"
          className={`transition-all duration-300 bg-neutral-200 dark:bg-black resize-none leading-4 text-sm focus:outline-none col-span-9 md:col-span-10 w-full h-fit p-3 rounded-xl scroll`}
          placeholder="Enter a message..."
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />

        <button
          disabled={loading || message.length === 0}
          type="submit"
          className="focus:outline-none col-span-2 md:col-span-1 border-secondary rounded-xl duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary disabled:bg-purple-300 text-white"
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

export default AdminMessageInput;
