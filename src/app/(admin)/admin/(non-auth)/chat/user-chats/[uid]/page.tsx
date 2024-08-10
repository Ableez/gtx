"use client";

import React, { useEffect, useState } from "react";
import { Conversation } from "../../../../../../../../chat";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import Loading from "@/app/loading";
import ChatCard from "@/components/admin/chat/ChatCard";

type Props = { params: { uid: string } };

const UserChatPage = ({ params }: Props) => {
  const [chats, setChats] = useState<{ id: string; data: Conversation }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const messagesRef = collection(db, "Messages");
    const q = query(
      messagesRef,
      where("user.uid", "==", params.uid),
      orderBy("updated_at", "desc")
    );

    // const q = query(messagesRef, orderBy("updated_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Conversation,
        }));

        const sortedChats = fetchedChats.map((chat) => ({
          ...chat,
          data: {
            ...chat.data,
            messages: chat.data.messages.sort((a, b) => {
              const timeStampA = new Date(
                a.timeStamp.seconds * 1000 + a.timeStamp.nanoseconds / 1e6
              );
              const timeStampB = new Date(
                b.timeStamp.seconds * 1000 + b.timeStamp.nanoseconds / 1e6
              );
              return timeStampA.getTime() - timeStampB.getTime();
            }),
          },
        }));

        setChats(sortedChats);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        setError(
          "Failed to fetch chats. Please check your internet connection and try again."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="p-8 m-4 text-center mb-4 text-base font-medium">
        <span className="capitalize">{chats[0]?.data.user.username}</span>
        &apos;s messages
      </div>
      {chats.map((chat, idx) => (
        <ChatCard isAdmin={false} key={idx} chat={chat} />
      ))}
    </div>
  );
};

export default UserChatPage;
