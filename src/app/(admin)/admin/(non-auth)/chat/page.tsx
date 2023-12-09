"use client";

import Loader from "@/components/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { db } from "@/lib/utils/firebase";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
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

const AdminChats = (props: Props) => {
  const [chatList, setChatList] = useState<Array<ChatObject>>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "Messages"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const chatData = querySnapshot.docs.map((doc) => {
            if (doc.exists()) {
              return { id: doc.id, data: doc.data() };
            } else {
            }
          });

          const sortedChats = chatData.sort((a, b) => {
            const timeA =
              a?.data.lastMessage.timeStamp.seconds * 1000 +
              a?.data.lastMessage.timeStamp.nanoseconds / 1e6;
            const timeB =
              b?.data.lastMessage.timeStamp.seconds * 1000 +
              b?.data.lastMessage.timeStamp.nanoseconds / 1e6;
            return timeB - timeA;
          });

          setChatList(sortedChats as Array<ChatObject>);
          console.log(chatList);
        });

        return () => unsubscribe(); // Cleanup the subscription when the component unmounts
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

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

  if (error) {
    return (
      <div className="container">
        <Alert className="gap-1 grid">
          <span className="text-2xl">👶🏽</span>
          <AlertTitle>Oh! you are new here</AlertTitle>
          <AlertDescription className="dark:text-neutral-400">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderChats = chatList?.map((chat, idx) => {
    if (chatList.length < 0) {
      return (
        <div key={idx} className="grid place-items-center justify-center py-16">
          <Loader />
        </div>
      );
    }
    return (
      <Link
        href={`/admin/chat/${chat?.id}` || ""}
        key={idx}
        className="flex align-middle place-items-center justify-between gap-3 dark:bg-neutral-800x dark:active:bg-neutral-700 p-2 active:bg-white hover:bg-white"
      >
        <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
        <div className="w-full">
          <h4 className="truncate w-52">{chat?.data?.lastMessage?.text}</h4>
          <p className="text-xs text-neutral-500">
            {chat?.data?.lastMessage?.sender}
          </p>
          <p>
            {formatTime(
              new Date(
                chat.data?.lastMessage?.timeStamp?.seconds * 1000 +
                  chat.data?.lastMessage?.timeStamp?.nanoseconds / 1e6
              )
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" rounded-full">
            <EllipsisVerticalIcon
              width={53}
              className="p-3 hover:bg-neutral-300"
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

  return (
    <div className="container">
      <div className="flex align-middle place-items-center justify-between">
        <Link
          href={"/admin"}
          className="bg-white  px-2 rounded-lg flex align-middle place-items-center justify-between gap-2 w-fit py-2"
        >
          <ArrowLeftIcon width={18} />
          <h4 className="font-bold text-base">Back</h4>
        </Link>
      </div>

      <div className="divide-y grid grid-flow-row py-4">
        {renderChats || (
          <Alert className="gap-1 grid">
            <span className="text-2xl">❌</span>
            <AlertTitle>Oh! The village people at work</AlertTitle>
            <AlertDescription className="dark:text-neutral-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AdminChats;
