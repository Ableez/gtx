"use client";

import { db } from "@/lib/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import type { Conversation, Message } from "../../../../../../../chat";
import { postToast } from "@/components/postToast";
import PageDataFetchError from "@/components/PageDataFetchError";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import dynamic from "next/dynamic";

type Props = {
  params: {
    chatId: string;
  };
};

const cachedUser = Cookies.get("user");

const AdminChatWrapper = dynamic(
  () => import("@/components/admin/chat/AdminChatWrapper"),
  {
    ssr: false,
  }
);

const AdminChatScreen = ({ params }: Props) => {
  const user = cachedUser ? JSON.parse(cachedUser) : null;
  const router = useRouter();
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState<Message>();
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const messages = adminCurrConversationStore((state) => state.conversation);

  const updateConversation = adminCurrConversationStore(
    (state) => state.updateConversation
  );

  // Check if user is logged in, if not show unauthorized toast and redirect to login page
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
    // Fetch chat data from Firestore and update state
    const unsubscribe = onSnapshot(
      doc(
        db,
        process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
        params.chatId
      ),
      (doc) => {
        if (!doc.exists()) {
          postToast("Poor internet connection");
          return;
        } else if (doc.data()) {
          const fetchedMessages = doc.data() as Conversation;

          // Sort messages by timeStamp
          const sortedArray = fetchedMessages.messages.sort((a, b) => {
            if (!a.timeStamp.seconds || !b.timeStamp.seconds) {
              console.log("SECS", a.timeStamp);
              return 0;
            }

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

          // zustand
          updateConversation(newChat as Conversation);

          // Scroll to the bottom of the chat
        }
      }
    );

    if (scrollToBottom.current) {
      scrollToBottom.current.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }

    return () => unsubscribe();
  }, [params.chatId, router, newMessage, updateConversation, scrollToBottom]);

  // If messages are not loaded yet, show loading message and options to reload or start over
  if (!messages && error) {
    return <PageDataFetchError error={error} />;
  }

  return (
    <AdminChatWrapper scrollToBottom={scrollToBottom} chatId={params.chatId} />
  );
};

export default AdminChatScreen;
