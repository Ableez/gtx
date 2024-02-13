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

type Props = {};

const AdminChat = (props: Props) => {
  const [chatList, setChatList] = useState<ConversationCollections>();
  const [empty, setEmpty] = useState(false);

  const markRead = async (chat: LastMessage, id: string) => {
    const chatRef = doc(db, "Messages", id);
    const chatData = {
      "lastMessage.read_receipt": {
        ...chat.read_receipt,
        delivery_status: "seen",
        status: true,
      },
    };
    await updateDoc(chatRef, chatData);
  };

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
    return (
      <div
        key={idx}
        className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-lg mx-auto hover:bg-neutral-200"
      >
        <Link
          href={`/admin/chat/${chat?.id}`}
          className="grid grid-flow-col align-middle place-items-top gap-3 md:gap-10 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
          onClick={() => markRead(chat.data.lastMessage, chat.id)}
        >
          <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
            {chat.data.user.photoUrl ? (
              <Image
                src={chat.data.user.photoUrl}
                alt={chat.data.user.username}
                width={40}
                height={40}
                className="aspect-square rounded-full object-cover"
              />
            ) : (
              <div className="p-5 h-8 w-8 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary" />
            )}
            <div className="">
              <h4
                className={`${
                  chat?.data?.lastMessage?.read_receipt.status
                    ? ""
                    : "font-semibold text-secondary"
                } truncate max-w-[13rem]`}
              >
                {chat?.data?.lastMessage?.content.media ? (
                  <div className="flex align-middle place-items-center justify-start gap-1">
                    <ImageIcon width={18} />
                    <p>Media</p>
                  </div>
                ) : (
                  chat.data.lastMessage.content.text
                )}
              </h4>
              <div className="flex align-middle place-items-center justify-between pt-1.5">
                <p className="text-xs text-neutral-400 font-medium capitalize">
                  {chat?.data?.user.username || "User"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 justify-self-end float-right">
            {formatTime(
              new Date(
                (chat?.data?.updated_at.seconds ?? 0) * 1000 +
                  (chat?.data?.updated_at.nanoseconds ?? 0) / 1e6
              ).toISOString()
            )}
          </p>
        </Link>
      </div>
    );
  });

  return (
    <div className="mx-auto w-full">
      {empty ? <p className="py-6 text-center">No chats yet</p> : renderChats}
    </div>
  );
};

export default AdminChat;
