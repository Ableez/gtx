import Image from "next/image";
import Link from "next/link";
import React from "react";
import { User } from "../../../types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { ChatBubbleIcon, ImageIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import TransactionCard from "./transactions/TransactionCard";
import { LastMessage, TransactionRec } from "../../../chat";
import { NewType } from "./users/DisplayUserPage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import { Skeleton } from "../ui/skeleton";

type Props = {
  user: NewType;
};

const Usercard = ({ user }: Props) => {
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
  return (
    <AccordionItem value={user.id}>
      <AccordionTrigger className="flex gap-4 py-3 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-100 ease-in cursor-pointer h-fit max-w-lg w-full mx-auto hover:no-underline">
        <div className="rounded-full aspect-square grid place-items-center object-fill border-2 border-white overflow-clip bg-white">
          <Image
            className="self-center dark:opacity-40 aspect-square object-cover"
            src={user.imageUrl || "/logoplace.svg"}
            width={50}
            height={50}
            alt="vendor"
          />
        </div>

        <div className="place-self-start w-full grid grid-flow-row place-items-start">
          <h4 className="capitalize font-semibold">{user.username}</h4>
          <p className="text-neutral-500 font-normal text-xs">{user.email}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-6 py-2 bg-white">
          <h4 className="font-medium uppercase text-[10px] tracking-wider text-neutral-500 mb-4">
            User Actions
          </h4>

          <div className="grid grid-flow-row gap-2">
            <Dialog>
              <DialogTrigger>
                <Button
                  className="w-full hover:text-neutral-600 flex align-middle place-items-center justify-center gap-2"
                  variant={"outline"}
                  size={"sm"}
                >
                  <ChatBubbleIcon width={22} strokeWidth={2.8} />
                  View conversation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <h4 className="text-md font-bold mb-4">User Conversations</h4>
                  {user.chats.map((chat, idx: number) => {
                    if (chat) {
                      return (
                        <div
                          key={idx}
                          className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-lg mx-auto hover:bg-neutral-200"
                        >
                          <Link
                            href={`/admin/chat/${chat?.id}`}
                            className="grid grid-flow-col align-middle place-items-top gap-3 md:gap-10 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
                            onClick={() =>
                              markRead(
                                chat?.lastMessage as LastMessage,
                                chat?.id as string
                              )
                            }
                          >
                            <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
                              {chat?.user.photoUrl ? (
                                <Image
                                  src={chat?.user.photoUrl || "/logoplace.svg"}
                                  alt={chat?.user.username}
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
                                    chat?.lastMessage?.read_receipt.status
                                      ? ""
                                      : "font-semibold text-secondary"
                                  } truncate max-w-[13rem]`}
                                >
                                  {chat?.lastMessage?.content.media ? (
                                    <div className="flex align-middle place-items-center justify-start gap-1">
                                      <ImageIcon width={18} />
                                      <p>Media</p>
                                    </div>
                                  ) : (
                                    chat?.lastMessage.content.text
                                  )}
                                </h4>
                                <div className="flex align-middle place-items-center justify-between pt-1.5">
                                  <p className="text-xs text-neutral-400 font-medium capitalize">
                                    {chat?.user.username || "User"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p className="text-[10px] text-neutral-500 justify-self-end float-right">
                              {formatTime(
                                new Date(
                                  (chat?.updated_at.seconds ?? 0) * 1000 +
                                    (chat?.updated_at.nanoseconds ?? 0) / 1e6
                                ).toISOString()
                              )}
                            </p>
                          </Link>
                        </div>
                      );
                    } else {
                      return (
                        <div key={`axile${idx}`}>
                          <Skeleton className="w-full h-8" />
                        </div>
                      );
                    }
                  })}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <Button
                  className="w-full hover:text-neutral-600 flex align-middle place-items-center justify-center gap-2"
                  variant={"outline"}
                  size={"sm"}
                >
                  <CurrencyDollarIcon width={22} />
                  View transactions
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <h4 className="text-md font-bold mb-4">User Transactions</h4>
                  {user.transactions.map(
                    (transaction: TransactionRec, idx: number) => {
                      return (
                        <TransactionCard
                          key={idx}
                          transaction={transaction}
                          idx={idx}
                        />
                      );
                    }
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex align-middle place-items-center justify-between w-full mt-4">
            <button className="py-2 font-medium duration-300 rounded-bl-lg bg-orange-100 hover:bg-orange-200 w-full ease-in border-2 border-transparent hover:border-orange-300">
              Suspend user
            </button>
            <button className="py-2 font-medium duration-300 bg-emerald-100 hover:bg-emerald-200 w-full border-2 border-transparent hover:border-emerald-300">
              Verify email
            </button>
            <button className="py-2 font-medium duration-300 rounded-br-lg bg-rose-100 hover:bg-rose-200 w-full border-2 border-transparent hover:border-rose-300">
              Block User
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Usercard;
