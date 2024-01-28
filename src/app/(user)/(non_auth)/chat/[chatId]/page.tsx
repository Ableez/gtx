"use client";

import { db } from "@/lib/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { redirect, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Conversation, Message } from "../../../../../../chat";
const UserChatWrapper = dynamic(() => import("@/components/chat/ChatWrapper"), {
  ssr: false,
});

type Props = {
  params: {
    chatId: string;
  };
};

const UserChatScreen = ({ params }: Props) => {
  const [messages, setMessages] = useState<Conversation>();
  const cachedUser = Cookies.get("user");
  const user = cachedUser ? JSON.parse(cachedUser) : null;
  const router = useRouter();
  const [error, setError] = useState("");
  const scrollToBottom = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<Message>();

  useEffect(() => {
    if (!user) {
      redirect("/sell");
    }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        if (!doc.exists()) {
          setError("chat not found!");
          // router.replace("/sell");
        } else if (doc.data()) {
          const fetchedMessages = doc.data() as Conversation;

          setMessages(fetchedMessages);

          if (scrollToBottom.current) {
            scrollToBottom.current.scrollIntoView({
              behavior: "smooth",
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

  useEffect(() => {
    if (error === "chat not found!") {
    }
  }, [error, router]);

  if (!messages)
    <div className="text-center p-8">
      Please wait...{" "}
      <div>
        <p>{error}</p>
        <div>
          <Link href={"/sell"}>Start over</Link>
          <Button onClick={() => router.refresh()}>Reload page</Button>
        </div>
      </div>
    </div>;

  return (
    <>
      <UserChatWrapper
        user={user}
        id={params.chatId}
        allMessages={messages}
        sendMessageAction={sendMessageAction}
        updateMessages={setMessages}
        scrollToBottom={scrollToBottom}
        setNewMessage={setNewMessage}
      />
    </>
  );
};

export default UserChatScreen;
