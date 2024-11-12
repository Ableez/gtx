"use client";
import { formatDistanceToNow } from "date-fns";
import { ChatWithRelations } from "@/server/db/schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "@/trpc/react";
import { useChatStore } from "@/lib/stores/chat-store";
import { ImageIcon } from "lucide-react";

type Props = {
  chat: ChatWithRelations;
};

const currenciesSymbol = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

const ChatCard = ({ chat }: Props) => {
  const utils = api.useUtils();
  const markChatAsSeen = api.adminChat.markAsSeen.useMutation({
    onSuccess: () => {
      utils.adminChat.getAllChats.invalidate();
      utils.adminChat.getChatsByUserId.invalidate({ userId: chat.userId });
    },
  });

  const { updateChat } = useChatStore();
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (chat.lastMessageStatus === "SEEN") {
          router.push(`/admin/chat/${chat.id}`);
          return;
        }

        updateChat(chat.id, {
          lastMessageStatus: "SEEN",
        });

        markChatAsSeen.mutate({
          chatId: chat.id,
          messageIds: [],
        });

        router.push(`/admin/chat/${chat.id}`);
      }}
      key={chat.id}
    >
      <div
        className={
          "flex align-middle place-items-center justify-between px-4 py-3 cursor-pointer w-full hover:bg-white/10 duration-500 ease-out transition-all relative"
        }
      >
        <div
          className={`${
            chat.lastMessageStatus !== "SEEN" ? "bg-primary" : ""
          } w-1.5 h-1.5 rounded-full aspect-square absolute left-1.5 top-1/2 -translate-y-1/2`}
        />
        <div className={"flex align-middle place-items-center gap-3"}>
          <Image
            src={chat.asset?.coverImage ?? "/logo.svg"}
            alt={"Vendor Logo"}
            width={38}
            height={38}
          />
          <div className={"flex flex-col gap-1"}>
            <p
              className={`${
                chat.lastMessageStatus !== "SEEN" ? "text-primary" : ""
              } text-sm font-medium leading-none`}
            >
              {chat.lastMessageContentType === "MEDIA" ? (
                <span className="flex align-middle place-items-center gap-1">
                  <ImageIcon size={17} />
                  <span className="truncate max-w-[10rem] md:max-w-[13rem] text-xs">
                    {chat.lastMessageText?.length! > 0
                      ? chat.lastMessageText
                      : "Attachment"}
                  </span>
                </span>
              ) : chat.lastMessageText?.length! > 0 ? (
                chat.lastMessageText
              ) : (
                chat.asset?.name
              )}{" "}
            </p>
            <p className="flex align-middle place-items-center gap-2 text-[12px] opacity-70 leading-none">
              <span>{chat.user?.username}</span>
              <span>•</span>
              <span className="flex align-middle place-items-center gap-1">
                <span>
                  {chat.asset?.name}{" "}
                  {chat.asset?.type === "GIFTCARD" ? " card" : " coin"}
                </span>
                <span>•</span>
                <span className="">
                  {currenciesSymbol[chat.trade?.currency ?? "USD"]}{" "}
                  {chat.trade?.amountInCurrency}
                </span>
              </span>
            </p>
          </div>
        </div>

        <h4 className={"text-[10px]"}>
          {formatDistanceToNow(chat.lastMessageTime ?? chat.updatedAt)}
        </h4>
      </div>
    </div>
  );
};

export default ChatCard;
