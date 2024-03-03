"use client";
import { db } from "@/lib/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Conversation, Message } from "../../../../../../chat";
import { postToast } from "@/components/postToast";
const UserChatWrapper = dynamic(() => import("@/components/chat/ChatWrapper"), {
  ssr: false,
});

type Props = {
  params: {
    chatId: string;
  };
};
const cachedUser = Cookies.get("user");

const UserChatScreen = ({ params }: Props) => {
  const [messages, setMessages] = useState<Conversation>();
  const user = cachedUser ? JSON.parse(cachedUser) : null;
  const router = useRouter();
  const [error, setError] = useState("");
  const scrollToBottom = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<Message>();

  if (!user) {
    postToast("Unauthorized", {
      description: "You are not logged in",
      action: {
        label: "Login",
        onClick: () => router.push("/login"),
      },
    });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        if (!doc.exists()) {
          setError("chat not found!");
          postToast("No data!", {
            description: "Could not fetch chat data.",
            action: {
              label: "Retry",
              onClick: () => router.refresh(),
            },
          });
        } else if (doc.data()) {
          const fetchedMessages = doc.data() as Conversation;

          const sortedArray = fetchedMessages.messages.sort((a, b) => {
            const timeStampA = new Date(
              a.timeStamp.seconds * 1000 + a.timeStamp.nanoseconds / 1e6
            );

            const timeStampB = new Date(
              b.timeStamp.seconds * 1000 + b.timeStamp.nanoseconds / 1e6
            );

            return timeStampA.getTime() - timeStampB.getTime();
          });

          const newChat = {
            ...fetchedMessages,
            messages: sortedArray,
          };

          setMessages(newChat as Conversation);

          if (scrollToBottom.current) {
            scrollToBottom.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }
    );

    return () => unsubscribe();
  }, [params.chatId, router, newMessage]);

  const sendMessageAction = sendUserMessage.bind(
    null,
    { timeStamp: new Date() },
    params.chatId
  );

  if (!messages) {
    return (
      <div className="text-center p-8">
        Please wait...{" "}
        <div>
          <p>{error}</p>
          <div>
            <Button onClick={() => router.refresh()}>Reload page</Button>
            <Link href={"/sell"}>Start over</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserChatWrapper
      user={user}
      id={params.chatId}
      allMessages={messages}
      sendMessageAction={sendMessageAction}
      updateMessages={setMessages}
      scrollToBottom={scrollToBottom}
      setNewMessage={setNewMessage}
    />
  );
};

export default UserChatScreen;
