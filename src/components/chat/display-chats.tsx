"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import ChatCard from "@/components/admin/chat/ChatCard";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import Loading from "@/app/loading";
import { Conversation } from "../../../chat";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { formatTime } from "@/lib/utils/formatTime";

type Props = {
  isAdmin: boolean;
};

const uc = Cookies.get("user");
const cachedUser = JSON.parse(uc ?? "{}");

const DisplayChats: React.FC<Props> = ({ isAdmin }) => {
  const [chats, setChats] = useState<{ id: string; data: Conversation }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const messagesRef = collection(db, "Messages");
    const q = isAdmin
      ? query(messagesRef, orderBy("updated_at", "desc"))
      : query(
          messagesRef,
          where("user.uid", "==", cachedUser.uid),
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
  }, [isAdmin]);

  if (!cachedUser) {
    return redirect("/sell");
  }

  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || chats.length === 0) {
    return (
      <div className="error">
        <p>{error ? "Error fetching chats" : "No chats found"}</p>
        <p>{error || "Start a new conversation to see chats here"}</p>
        <Button onClick={handleRetry}>
          <ReloadIcon className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  const adminChats = chats.map((chat) => ({ count: 0, ...chat }));

  const groupChats = () => {
    const map = new Map<string, (typeof adminChats)[0]>();

    for (const chat of adminChats) {
      const { data } = chat;
      if (map.has(data.user.uid)) {
        map.get(data.user.uid)!.count += 1;
      } else {
        map.set(data.user.uid, chat);
      }
    }

    return Array.from(map, ([id, { data, count }]) => ({
      id,
      count,
      data,
    }));
  };

  console.log(groupChats());

  return (
    <div className="chat-list">
      {isAdmin
        ? groupChats().map((chat, idx) => {
            const isUnread = !chat.data.lastMessage.read_receipt.status;
            const isFromCurrentUser =
              chat.data.lastMessage.sender === cachedUser.uid;

            const getMessageTextClass = () => {
              if (isUnread && !isFromCurrentUser) {
                return "font-semibold text-secondary";
              }
              return "";
            };

            return (
              <div
                key={idx}
                className="flex items-center justify-between h-fit w-full duration-300 max-w-lg mx-auto hover:bg-neutral-200 dark:hover:bg-black/20 pl-4 group"
              >
                {!chat.data.lastMessage.read_receipt.status && (
                  <div className="p-1 rounded-full bg-primary" />
                )}
                <Link
                  href={`/admin/chat/user-chats/${chat.data.user.uid}`}
                  className="flex items-center justify-between dark:bg-opacity-10 dark:active:bg-black pr-4 pl-2 py-3 duration-300 dark:text-white w-full h-fit"
                >
                  {chat.count < 2 &&
                    (chat.data.user.photoUrl ? (
                      <Image
                        src={chat.data.user.photoUrl}
                        alt={chat.data.user.username}
                        width={45}
                        height={45}
                        className="aspect-square rounded-full object-cover"
                      />
                    ) : (
                      <div className="p-5 h-12 w-12 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary" />
                    ))}
                  {chat.count >= 2 &&
                    (chat.data.user.photoUrl ? (
                      <div className="flex align-middle place-items-center justify-start pl-4">
                        {Array.from({ length: 2 }).map((_, idx) => (
                          <Image
                            src={chat.data.user.photoUrl}
                            alt={chat.data.user.username}
                            width={45}
                            height={45}
                            className="aspect-square rounded-full object-cover -ml-5 border-4 duration-300 group-hover:border-neutral-200 border-neutral-50"
                          />
                        ))}
                        <div
                          key={idx}
                          className="w-6 h-6 text-[10px] flex place-items-center align-middle justify-center font-semibold rounded-full self-center shadow-primary -ml-5 bg-neutral-50"
                        >
                          {chat.count}
                        </div>
                      </div>
                    ) : (
                      <div className="flex align-middle place-items-center justify-start pl-4">
                        {Array.from({ length: 2 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 h-3 w-3 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary -ml-5 border-4 duration-300 group-hover:border-neutral-200 border-neutral-50"
                          />
                        ))}
                        <div
                          key={idx}
                          className="w-6 h-6 text-[10px] flex place-items-center align-middle justify-center font-semibold rounded-full self-center shadow-primary -ml-5 bg-neutral-50"
                        >
                          {chat.count}
                        </div>
                      </div>
                    ))}

                  <div className="w-full pl-4">
                    <h4
                      className={`truncate max-w-[10rem] md:max-w-[13rem] ${getMessageTextClass()}`}
                    >
                      {chat.data.lastMessage.content.media ? (
                        <div className="flex items-center gap-1">
                          <ImageIcon size={16} />
                          <p>Image</p>
                        </div>
                      ) : (
                        chat.data.lastMessage.content.text
                      )}
                    </h4>
                    <div className="flex items-center justify-between pt-1 w-full h-fit">
                      <p
                        className={`text-xs text-neutral-400 font-medium capitalize`}
                      >
                        {isFromCurrentUser ? "you" : chat.data.user.username}
                      </p>
                      <p className="text-[12px] text-neutral-500">
                        {formatTime(
                          new Date(
                            (chat.data.updated_at.seconds ?? 0) * 1000 +
                              (chat.data.updated_at.nanoseconds ?? 0) / 1e6
                          ).toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        : chats.map((chat, idx) => (
            <ChatCard isAdmin={false} key={idx} chat={chat} />
          ))}
    </div>
  );
};

export default DisplayChats;
