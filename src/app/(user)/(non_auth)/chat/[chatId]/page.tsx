"use client";
import { db } from "@/lib/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Conversation } from "../../../../../../chat";
import { postToast } from "@/components/postToast";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import PageDataFetchError from "@/components/PageDataFetchError";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type Props = {
  params: {
    chatId: string;
  };
};

const UserChatWrapper = dynamic(() => import("@/components/chat/ChatWrapper"), {
  ssr: false,
});

/**
 * UserChatScreen component displays the chat screen for a specific user.
 * Props} params - The component props containing the chatId.
 * JSX.Element} The rendered UserChatScreen component.
 */

const cachedUser = Cookies.get("user");
const user = cachedUser ? JSON.parse(cachedUser) : null;

const UserChatScreen = ({ params }: Props): JSX.Element => {
  const router = useRouter();
  const [error, setError] = useState("");
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const messages = useMessagesStore((state) => state.conversation);

  const updateConversation = useMessagesStore(
    (state) => state.updateConversation
  );

  // Check if user is logged in, if not show unauthorized toast and redirect to login page
  useEffect(() => {
    if (!user) {
      postToast("Unauthorized", {
        description: "You are not logged in",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });

      window.location.href = "/login";
    }
  }, [router]);

  useEffect(() => {
    // Fetch chat data from Firestore and update state
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        if (!doc.exists()) {
          postToast("Poor internet connection");
          setError(
            "Could not fetch chat data, This is usually due to a poor internet connection."
          );
          return;
        } else if (doc.data()) {
          const fetchedMessages = doc.data() as Conversation;

          // Sort messages by timestamp
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

          // zustand
          updateConversation(newChat as Conversation, scrollToBottom);
        }

        // Scroll to the bottom of the chat
      }
    );

    return () => unsubscribe();
  }, [params.chatId, updateConversation]);

  // If messages are not loaded yet, show loading message and options to reload or start over
  if (!messages && error) {
    return <PageDataFetchError error={error} />;
  }

  // Render the UserChatWrapper component with necessary props
  return (
    <UserChatWrapper scrollToBottom={scrollToBottom} chatId={params.chatId} />
  );
};

export default UserChatScreen;
