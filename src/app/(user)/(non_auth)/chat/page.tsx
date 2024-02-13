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
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};

type Chat = {
  id: string;
  data: {
    user_id: string;
    transactions: Record<string, unknown>; // Adjust this based on the actual type
    lastMessage: {
      media: boolean;
      sender: string;
      text: string;
      timeStamp: Date;
    };
    messages: Array<{
      media: string;
      text: string;
      sent_at: Date;
      lastMessage: {
        text: string;
        timeStamp: Date;
      };
    }>;
  };
};

const UserChats = (props: Props) => {
  const [chatList, setChatList] = useState<Array<Chat>>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetch = async () => {
      try {
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

          setChatList(chatData as Array<Chat>);
        });

        return () => unsubscribe(); // Cleanup the subscription when the component unmounts
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

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

  //   if (chatList.length === 0) {
  //     return (
  //       <div className="flex justify-center place-items-center p-16">
  //         <Loader />
  //       </div>
  //     );
  //   }

  const renderChats = chatList?.map((chat, idx) => {
    return (
      <Link
        href={`/chat/${chat?.id}` || ""}
        key={idx}
        className="flex align-middle place-items-center justify-between gap-3 dark:bg-neutral-800 dark:active:bg-neutral-700 p-2 active:bg-white hover:bg-white"
      >
        <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
        <div className="w-full">
          <h4 className="truncate w-52">{chat.data.lastMessage.text}</h4>
          <p className="text-xs text-neutral-500">
            {chat.data.lastMessage.sender}
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
        <Button
          variant={"outline"}
          className="flex align-middle place-items-center justify-between gap-2 w-fit py-2"
        >
          <ArrowLeftIcon width={18} />
          <h4 className="font-bold text-base">Chats</h4>
        </Button>
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

export default UserChats;
