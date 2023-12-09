"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "@/lib/utils/firebase";
import {
  ArrowRightIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

type ChatMessage = {
  media: string;
  seen_at?: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  sender: string;
};

type UserData = {
  username: string;
  id: string;
  email: string;
};

type LastMessage = {
  media: boolean;
  timeStamp: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  sender: string;
};

type ChatData = {
  messages: ChatMessage[];
  transactions: Record<string, unknown>;
  user: UserData;
  lastMessage: LastMessage;
};

type ChatObject = {
  id: string;
  data: ChatData;
};

const AdminPage = (props: Props) => {
  const [chatList, setChatList] = useState<Array<ChatObject>>([]);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (auth.currentUser) {
          const q = query(collection(db, "Messages"));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatData = querySnapshot.docs.map((doc) => {
              if (doc.exists()) {
                return { id: doc.id, data: doc.data() };
              } else {
                console.log("document does not exist");
              }
            });

            const sortedChats = chatData.sort((a, b) => {
              const timeA =
                a?.data?.lastMessage?.timeStamp?.seconds * 1000 +
                a?.data?.lastMessage?.timeStamp?.nanoseconds / 1e6;

              console.log(a);
              const timeB =
                b?.data?.lastMessage?.timeStamp?.seconds * 1000 +
                b?.data?.lastMessage?.timeStamp?.nanoseconds / 1e6;
              return timeB - timeA;
            });

            // Limit the result to 5 objects
            const limitedChats = sortedChats.slice(0, 3);

            setChatList(limitedChats as Array<ChatObject>);
          });

          return () => unsubscribe(); // Cleanup the subscription when the component unmounts
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  console.log("ChatList", chatList);
  function formatTime(date: Date) {
    const now = new Date();
    const diffInMilliseconds = now - date;

    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return "just now";
    } else if (minutes === 1) {
      return "1 minute ago";
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else if (hours < 24) {
      return `${hours} hours ago`;
    }
  }

  const renderChats = chatList?.map((chat, idx) => {
    return (
      <Link
        href={`/admin/chat/${chat?.id}` || ""}
        key={idx}
        className="flex align-middle place-items-center justify-between gap-3 dark:bg-neutral-800x dark:active:bg-neutral-700 p-2 active:bg-neutral-100 hover:bg-neutral-100 duration-300 dark:hover:bg-neutral-700/40 dark:text-white"
      >
        <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
        <div className="w-full">
          <h4 className="truncate w-52 max-w-[20rem]">
            {chat?.data?.lastMessage?.text}
          </h4>
          <p className="text-xs text-neutral-500 font-semibold">
            {chat?.data?.lastMessage?.sender || "User"}
          </p>
          <p className="text-xs text-secondary">
            {formatTime(
              new Date(
                chat?.data?.lastMessage?.timeStamp?.seconds * 1000 +
                  chat?.data?.lastMessage?.timeStamp?.nanoseconds / 1e6
              )
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" rounded-full">
            <EllipsisVerticalIcon
              width={53}
              className="p-3 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 mr-4 z-[9999] grid">
            <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
              Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="py-2">Info</DropdownMenuItem>
              <DropdownMenuItem className="py-2">Report</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="py-2 text-red-500 font-semibold flex align-middle place-items-center justify-between">
                Delete
                <TrashIcon width={20} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
    );
  });
  console.log(renderChats, "renderchatsss");

  return (
    <div className="container">
      <div className="grid grid-flow-col align-middle place-items-center justify-between gap-4 grid-cols-2">
        <Link
          className="grid place-items-center dark:bg-neutral-800 dark:ring-neutral-700 rounded-2xl shadow-md hover:shadow-xl hover:shadow-pink-100 hover:ring-1 hover:ring-secondary duration-300 shadow-pink-50 w-full h-32 dark:hover:shadow-pink-950/20 dark:shadow-pink-900/10 bg-white"
          href={"/admin/chat"}
        >
          <div className="grid place-items-center align-middle h-fit text-neutral-700 dark:text-neutral-300 font-bold">
            Messages
          </div>
        </Link>
        <Link
          className="grid place-items-center dark:bg-neutral-800 dark:ring-neutral-700 rounded-2xl shadow-md hover:shadow-xl hover:shadow-pink-100 hover:ring-1 hover:ring-secondary duration-300 shadow-pink-50 w-full h-32 dark:hover:shadow-pink-950/20 dark:shadow-pink-900/10 bg-white"
          href={"/admin/users"}
        >
          <div className="grid place-items-center align-middle h-fit text-neutral-700 dark:text-neutral-300 font-bold">
            Users
          </div>
        </Link>
      </div>

      <div className="my-8 bg-white dark:bg-neutral-800 px-4 pb-2 rounded-2xl z-40">
        <div className="dark:text-neutral-400 border-b my-1 dark:border-b-neutral-700 flex align-middle place-items-center justify-between py-3">
          <h4 className="font-semibold text-neutral-500">Latest</h4>
          <Button
            className="group duration-300 overflow-clip relative  hover:pr-9 pr-4"
            onClick={() => router.push("/admin/chats")}
          >
            View All{" "}
            <ArrowRightIcon
              width={18}
              className="duration-300 absolute top-1/2 -translate-y-1/2 -right-[1vw] group-hover:right-3 group-hover:opacity-100 opacity-0"
            />
          </Button>
        </div>

        <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800">
          {renderChats.length !== 0 ? (
            renderChats
          ) : (
            <div>
              <h4 className="dark:text-neutral-500 grid place-items-center p-16">
                No messages yet
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
