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

type Props = {
  chatList: ConversationCollections | undefined;
};

const QuickView = ({ chatList }: Props) => {
  const markRead = async (chat: LastMessage, id: string) => {
    const chatRef = doc(db, "Messages", chat?.id);
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
        className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-md min-w-fit hover:bg-neutral-200"
      >
        <Link
          href={`/admin/chat/${chat?.id}`}
          className="grid grid-flow-col align-middle place-items-top gap-3 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
          onClick={() => markRead(chat.data.lastMessage, chat.id)}
        >
          <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
            <div className="p-5 h-8 w-8 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary" />
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
            {/* {formatTime(
                  new Date(
                    (chat?.data?.lastMessage?.timeStamp?.seconds ?? 0) * 1000 +
                      (chat?.data?.lastMessage?.timeStamp?.nanoseconds ?? 0) /
                        1e6
                  ).toISOString()
                )} */}
            9:18 AM
          </p>
        </Link>
      </div>
    );
  });

  return (
    <div className="my-8 bg-white dark:bg-neutral-800 pb-2 rounded-2xl z-40">
      <div className="dark:text-neutral-400 border-b my-1 dark:border-b-neutral-700 flex align-middle place-items-center justify-between p-2">
        <h4 className="font-semibold text-neutral-500">Latest</h4>
        <Link
          href={"/admin/chat"}
          className="py-2 px-6 rounded-md text-[12px] text-secondary font-bold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800">
        {renderChats}
      </div>
    </div>
  );
};

export default QuickView;
