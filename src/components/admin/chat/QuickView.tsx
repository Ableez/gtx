import React from "react";
import {
  Conversation,
  ConversationCollections,
  LastMessage,
  MediaMeta,
  Sender,
} from "../../../../chat";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { ImageIcon } from "@radix-ui/react-icons";
import { formatTime } from "@/lib/utils/formatTime";
import Image from "next/image";

type Props = {
  chatList: ConversationCollections | undefined;
};

const QuickView = ({ chatList }: Props) => {
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

  const renderChats = chatList?.map((chat, idx) => {
    return (
      <div
        key={idx}
        className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-screen-md min-w-fit hover:bg-neutral-200 dark:hover:bg-neutral-700 mx-auto"
      >
        <Link
          href={`/admin/chat/${chat?.id}`}
          className="grid grid-flow-col align-middle place-items-top gap-3 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
          onClick={() => markRead(chat.data.lastMessage, chat.id)}
        >
          <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
            <Image
              src={chat.data.user.photoUrl || "/logoplace.svg"}
              width={45}
              height={45}
              alt={""}
              className="rounded-full aspect-square object-cover"
            />
            <div className="">
              <h4
                className={`${
                  chat?.data?.lastMessage?.read_receipt.status
                    ? ""
                    : "font-semibold text-secondary"
                } truncate md:max-w-[25rem] max-w-[13rem]`}
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
    <div className="my-8 bg-white border dark:bg-neutral-800 rounded-2xl z-40">
      <div className="dark:text-neutral-400 border-b dark:border-b-neutral-700 overflow-clip flex align-middle place-items-center justify-between p-2">
        <h4 className="font-semibold text-neutral-500 px-6">Latest Messages</h4>
        <Link
          href={"/admin/chat"}
          className="py-2 px-6 rounded-md text-[12px] text-secondary font-bold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800">
        {renderChats && renderChats?.length > 0 ? (
          renderChats
        ) : (
          <div className="p-6 text-center text-neutral-400 dark:text-neutral-600">
            No Chats yet
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickView;
