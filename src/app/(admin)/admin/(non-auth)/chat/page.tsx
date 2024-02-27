"use client";

import { auth, db } from "@/lib/utils/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ConversationCollections, LastMessage } from "../../../../../../chat";
import { ImageIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { formatTime } from "@/lib/utils/formatTime";
import ChatCard from "@/components/admin/chat/ChatCard";

type Props = {};

const AdminChat = (props: Props) => {
  const [chatList, setChatList] = useState<ConversationCollections>();
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (auth.currentUser) {
          const q = query(
            collection(db, "Messages"),
            orderBy("lastMessage.read_receipt.time", "desc")
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatData = querySnapshot.docs.map((doc) => {
              if (doc.exists()) {
                return { id: doc.id, data: doc.data() };
              } else {
                console.log("document does not exist");
              }
            });

            if (chatData.length === 0) {
              setEmpty(true);
            } else {
              setEmpty(false);
            }
            const sortedChats = chatData;

            setChatList(sortedChats as ConversationCollections);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  const renderChats = chatList?.map((chat, idx) => {
    return <ChatCard chat={chat} key={idx} />;
  });

  return (
    <div className="mx-auto w-full">
      {empty ? <p className="py-6 text-center">No chats yet</p> : renderChats}
    </div>
  );
};

export default AdminChat;
