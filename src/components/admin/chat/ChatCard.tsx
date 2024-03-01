"use client";
import { formatTime } from "@/lib/utils/formatTime";
import { ImageIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Conversation, LastMessage } from "../../../../chat";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";

type Props = {
  chat?: {
    id: string;
    data: Conversation;
  };
  chat2?: Conversation;
};

const ChatCard = ({ chat, chat2 }: Props) => {
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

  if (chat) {
    return (
      <div className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-lg mx-auto hover:bg-neutral-200">
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
                  chat?.data?.lastMessage?.read_receipt.status &&
                  chat.data.lastMessage.sender !== chat.data.user.uid
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
  } else {
    return (
      <div className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-lg mx-auto hover:bg-neutral-200">
        <Link
          href={`/admin/chat/${chat2?.id}`}
          className="grid grid-flow-col align-middle place-items-top gap-3 md:gap-10 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
          onClick={() =>
            markRead(chat2?.lastMessage as LastMessage, chat2?.id as string)
          }
        >
          <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
            {chat2?.user.photoUrl ? (
              <Image
                src={chat2?.user.photoUrl}
                alt={chat2?.user.username}
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
                  chat2?.lastMessage?.read_receipt.status
                    ? ""
                    : "font-semibold text-secondary"
                } truncate max-w-[13rem]`}
              >
                {chat2?.lastMessage?.content.media ? (
                  <div className="flex align-middle place-items-center justify-start gap-1">
                    <ImageIcon width={18} />
                    <p>Media</p>
                  </div>
                ) : (
                  chat2?.lastMessage.content.text
                )}
              </h4>
              <div className="flex align-middle place-items-center justify-between pt-1.5">
                <p className="text-xs text-neutral-400 font-medium capitalize">
                  {chat2?.user.username || "User"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 justify-self-end float-right">
            {formatTime(
              new Date(
                (chat2?.updated_at.seconds ?? 0) * 1000 +
                  (chat2?.updated_at.nanoseconds ?? 0) / 1e6
              ).toISOString()
            )}
          </p>
        </Link>
      </div>
    );
  }
};

export default ChatCard;
