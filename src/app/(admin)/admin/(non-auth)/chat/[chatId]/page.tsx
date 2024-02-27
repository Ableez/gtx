"use client";

import { db } from "@/lib/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { redirect, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardDetails, Conversation, Message } from "../../../../../../../chat";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";
import AdminChatWrapper from "@/components/admin/chat/AdminChatWrapper";
import { postToast } from "@/components/postToast";

type Props = {
  params: {
    chatId: string;
  };
};

const AdminChatScreen = ({ params }: Props) => {
  const [messages, setMessages] = useState<Conversation>();
  const cachedUser = Cookies.get("user");
  const user = cachedUser ? JSON.parse(cachedUser) : null;
  const router = useRouter();
  const [error, setError] = useState("");
  const scrollToBottom = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<Message>();

  useEffect(() => {
    if (!user) {
      postToast("Unauthorized", { description: "No user data not found!" });
      router.replace("/admin");
    }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        if (!doc.exists()) {
          setError("chat not found!");
          postToast("Error!", {
            description:
              "Could fetch chat data. Confirm that the chat has not been deleted already.",
          });
          router.back();
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

  const sendMessageAction = sendAdminMessage.bind(
    null,
    { timeStamp: new Date() },
    params.chatId,
    messages?.user as {
      username: string;
      uid: string;
      email: string;
      photoUrl: string;
    }
  );

  useEffect(() => {
    if (error === "chat not found!") {
      router.push("/admin/chat");
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
      <AdminChatWrapper
        card={messages?.transaction.cardDetails as CardDetails}
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

export default AdminChatScreen;
