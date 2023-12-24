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
import { formatTime } from "@/lib/utils/formatTime";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const AdminChats = (props: Props) => {
  const [chatList, setChatList] = useState<Array<ChatObject>>([]);
  const [error, setError] = useState<string>();
  const router = useRouter();

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
              a?.data.lastMessage.timeStamp.seconds * 1e9 +
              a?.data.lastMessage.timeStamp.nanoseconds;
            const timeB =
              b?.data.lastMessage.timeStamp.seconds * 1e9 +
              b?.data.lastMessage.timeStamp.nanoseconds;
            return timeB - timeA;
          });

          setChatList(sortedChats as Array<ChatObject>);
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

  const renderChats = chatList?.map((chat, idx) => {
    if (chatList.length < 0) {
      return (
        <div key={idx} className="grid place-items-center justify-center py-16">
          <Loader />
        </div>
      );
    }
    return (
      <div
        key={idx}
        className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-md min-w-fit hover:px-0.5"
      >
        <Link
          href={`/admin/chat/${chat?.id}`}
          className="flex align-middle place-items-center justify-between gap-3 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:hover:bg-neutral-700/40 dark:text-white rounded-l-md dark:rounded-l-none w-full h-fit"
          onClick={async () => {
            const chatRef = doc(db, "Messages", chat?.id);
            const chatData = {
              lastMessage: {
                ...chat?.data?.lastMessage,
                read: true,
              },
            };
            // Update the last message
            await updateDoc(chatRef, chatData);
          }}
        >
          <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
          <div className="w-full">
            <h4
              className={`${
                chat?.data?.lastMessage?.read ? "" : "font-bold text-secondary"
              } truncate max-w-[13rem]`}
            >
              {chat?.data?.lastMessage?.media ||
              chat?.data?.lastMessage?.text === "mdia__xyl" ? (
                <PhotoIcon width={22} />
              ) : (
                chat?.data?.lastMessage?.text
              )}
            </h4>
            <div className="flex align-middle place-items-center justify-between pt-1">
              <p className="text-xs text-neutral-400 font-medium capitalize">
                {chat?.data?.lastMessage?.sender || "User"}
              </p>
              <p className="text-[10px] text-secondary">
                {formatTime(
                  new Date(
                    (chat?.data?.lastMessage?.timeStamp?.seconds ?? 0) * 1000 +
                      (chat?.data?.lastMessage?.timeStamp?.nanoseconds ?? 0) /
                        1e6
                  ).toISOString()
                )}
              </p>
            </div>
          </div>
        </Link>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild className="rounded-r-md py-3.5">
            <EllipsisVerticalIcon width={30} className="p-1" />
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
        </DropdownMenu> */}
      </div>
    );
  });

  return (
    <div className="container">
      <div className="flex align-middle place-items-center justify-between">
        <Link
          href={"/admin"}
          className="bg-white dark:bg-neutral-800  px-3 rounded-lg flex align-middle place-items-center justify-between gap-2 w-fit py-2"
        >
          <ArrowLeftIcon width={18} />
          <h4 className="font-bold text-base">Back</h4>
        </Link>
        <div className="p-2 rounded-md bg-white dark:bg-neutral-800 relative">
          <h4 className="font-medium text-[12px] text-secondary">
            {chatList.filter((chat) => chat.data.lastMessage.read !== true)
              .length > 0 ? (
              <>
                {`${
                  chatList.filter((chat) => chat.data.lastMessage.read !== true)
                    .length
                } unread messages`}
                <div className="bg-secondary w-2 h-2 rounded-full absolute top-0 right-0" />
              </>
            ) : (
              <>{`${chatList.length} messages`} </>
            )}
          </h4>
        </div>
      </div>

      <div className="divide-y divide-purple-100 dark:divide-neutral-700 grid grid-flow-row my-4 bg-white dark:bg-neutral-800 rounded-lg">
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

      {chatList.length < 0 && <div>You dont have messages yet</div>}
    </div>
  );
};

export default AdminChats;
