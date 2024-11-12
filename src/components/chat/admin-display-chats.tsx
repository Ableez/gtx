"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Loading from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { formatTime } from "@/lib/utils/formatTime";
import { useUser } from "@clerk/nextjs";
import { useAdminChats } from "@/lib/hooks/new/admin/use-all-chats";
import { ChatWithRelations } from "@/server/db/schema";

const AdminDisplayChats = () => {
  const { user } = useUser();
  const { chats, isFetchChatLoading, isFetchChatsError, loadMore, hasMore } =
    useAdminChats();

  if (isFetchChatLoading && !chats) {
    return <Loading />;
  }

  if (isFetchChatsError) {
    return (
      <div className="error w-full h-screen flex flex-col gap-8 place-items-center pt-16">
        <p className="font-bold text-2xl uppercase">Error fetching chats</p>
        <p>There was an error fetching the chats. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>
          <ReloadIcon className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const groupChats = () => {
    if (!chats) return [];
    const sortedChats = chats.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    const map = new Map<string, ChatWithRelations & { count: number }>();

    for (const chat of sortedChats) {
      if (map.has(chat.userId)) {
        map.get(chat.userId)!.count += 1;
      } else {
        map.set(chat.userId, { ...chat, count: 1 });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  const groupedChats = groupChats();

  return (
    <div>
      {groupedChats.map((chat) => {
        const isUnread =
          chat.lastMessageId && chat.messages?.[0]?.status !== "SEEN";
        const isFromAdmin = chat.messages?.[0]?.isAdmin;

        const getMessageTextClass = () => {
          if ((isUnread && !isFromAdmin) || !chat.lastMessageId) {
            return "font-semibold text-secondary";
          }
          return "";
        };

        return (
          <div
            key={chat.id}
            className="flex items-center justify-between h-fit w-full duration-300 max-w-lg mx-auto hover:bg-neutral-200 dark:hover:bg-black/20 pl-4 group relative"
          >
            {!isFromAdmin && isUnread && (
              <div className="p-1 rounded-full bg-primary absolute left-2 top-1/2 -translate-y-1/2" />
            )}
            <Link
              href={`/admin/chat/user-chats/${chat.userId}`}
              className="flex items-center justify-between dark:bg-opacity-10 dark:active:bg-black pr-4 pl-2 py-3 duration-300 dark:text-white w-full h-fit relative"
            >
              {chat.count < 2 ? (
                <div className={"relative"}>
                  <Image
                    src={
                      chat.user?.imageUrl ||
                      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
                    }
                    alt={chat.user?.username || "Profile image"}
                    width={45}
                    height={45}
                    className="aspect-square rounded-full object-cover"
                  />
                  <Image
                    src={
                      chat.asset?.coverImage ||
                      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
                    }
                    alt={chat.user?.username || "Profile image"}
                    width={24}
                    height={24}
                    className="aspect-square absolute -bottom-0.5 border-2 border-white -right-0.5 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex align-middle place-items-center justify-start">
                  <Image
                    src={
                      chat.user?.imageUrl ??
                      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
                    }
                    alt={chat.user?.username ?? "Profile image"}
                    width={45}
                    height={45}
                    className={`aspect-square rounded-full object-cover  border-4 duration-300  border-neutral-50 dark:border-black`}
                  />
                  <Image
                    src={
                      chat.user?.imageUrl ??
                      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
                    }
                    alt={chat.user?.username ?? "Profile image"}
                    width={45}
                    height={45}
                    className={`aspect-square scale-75 rounded-full object-cover border-4 duration-300 border-neutral-50 dark:border-black absolute left-[14px]`}
                  />
                </div>
              )}

              <div className="w-full pl-4">
                <h4
                  className={`truncate max-w-[10rem] md:max-w-[13rem] ${getMessageTextClass()}`}
                >
                  {chat.lastMessageContentType === "MEDIA" ? (
                    <div className="flex items-center gap-1">
                      <ImageIcon size={17} />
                      <p className="truncate max-w-[10rem] md:max-w-[13rem] text-xs">
                        {chat.lastMessageText?.length! > 0
                          ? chat.lastMessageText
                          : "Attachment"}
                      </p>
                    </div>
                  ) : (
                    chat.lastMessageText ?? chat.asset?.name
                  )}
                </h4>
                <div className="flex items-center justify-between w-full h-fit">
                  <p className="text-xs text-neutral-400 font-medium capitalize">
                    {chat.messages?.[0]?.senderId === user?.id
                      ? "you"
                      : chat.user?.username}
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    {formatTime(
                      chat.lastMessageTime?.toString() ??
                        chat.updatedAt.toString() ??
                        chat.createdAt.toString()
                    )}
                  </p>
                </div>
              </div>
              {!chat.lastMessageId && (
                <div className="absolute right-2 top-1">
                  <p className="px-2 py-1 bg-green-600 rounded-sm scale-[0.5] font-semibold uppercase">
                    New
                  </p>
                </div>
              )}
            </Link>
          </div>
        );
      })}

      {hasMore && (
        <div className={"p-4 w-full"}>
          <Button
            onClick={() => loadMore()}
            variant="link"
            className="w-full mt-4"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminDisplayChats;
