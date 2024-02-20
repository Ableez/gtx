"use client";

import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import { giftcards } from "@/lib/data/giftcards";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import ApproveTransaction from "@/components/admin/transactions/approve_transaction";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import { cancelTransaction } from "@/lib/utils/adminActions/startTransaction";
import DownloadReceipt from "@/components/admin/transactions/download_receipt";
import { Separator } from "@/components/ui/separator";
import { TransactionRec } from "../../../../../../chat";
import { User } from "../../../../../../types";
import TransactionSkeleton from "@/components/skeletons/TransactionSkeleton";

type Props = {
  params: {
    _id: string;
  };
};

const TransactionDetail = ({ params }: Props) => {
  const [transaction, setTransaction] = useState<TransactionRec>();
  const transactionId = params._id;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1800);
  }, [copied]);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "Transactions", transactionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = {
            ...docSnap.data(),
            id: docSnap.id,
          } as TransactionRec;
          const docRef = doc(db, "Users", data.userId);
          const userSnap = await getDoc(docRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as User);
          } else {
            console.log("User not found");
          }

          setTransaction(data);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction data", error);
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const date = formatTime(
    new Date(
      (transaction?.created_at?.seconds ?? 0) * 1000 +
        (transaction?.created_at?.nanoseconds ?? 0) / 1e6
    ).toISOString()
  );

  return (
    <div className="relative max-w-screen-sm py-8 mx-auto">
      {transaction ? (
        <>
          <div className="">
            <div className="flex w-full justify-start place-items-start px-8 mx-auto gap-4 py-4">
              <Image
                src={"/logoplace.svg"}
                alt="Vendor Logo"
                width={35}
                height={35}
                className="p-1 bg-purple-400 rounded-full mt-1 border-purple-200 border-4 box-content"
              />
              <div>
                <h6 className="font-semibold text-base">
                  {transaction?.data.cardDetails.vendor} Card
                </h6>
                <h6 className="text-[10px] ">
                  {transaction?.data.cardDetails.subcategory.value}
                </h6>
                <h6 className="font-bold text-base">
                  ₦
                  {transaction?.data.cardDetails?.rate &&
                    formatCurrency(transaction.data.cardDetails.rate)}
                </h6>
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row py-4 gap-2">
            <div className="  px-4">
              <h6 className=" dark:text-neutral-300 text-[12px]">Time</h6>
              <h6 className="">{date}</h6>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4">
              <h6 className=" dark:text-neutral-300 text-[12px]">
                {user?.email}
              </h6>
              <h6 className="">{user?.username}</h6>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4">
              <span className=" text-[12px] ">
                {transaction?.data.cardDetails.subcategory.value}
              </span>
              <h6 className="font-semibold">
                {transaction?.data.cardDetails.price}
              </h6>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4 flex align-middle place-items-center justify-between">
              <div>
                <span className="  dark:text-neutral-300 text-[12px]">
                  Payment Method
                </span>
                <h6 className="font-semibold">{transaction?.payment.method}</h6>
              </div>
              <div className="text-left font-semibold text-xs">
                <ul>
                  <li>{transaction?.data.accountDetails.accountNumber}</li>
                  <li>{transaction?.data.accountDetails.accountName}</li>
                  <li>{transaction?.data.accountDetails.bankName}</li>
                </ul>
              </div>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4 flex align-middle place-items-center justify-between">
              <div>
                <span className="  dark:text-neutral-300 text-[12px]">
                  Status
                </span>
                <h6 className="flex align-middle place-items-center gap-2 font-semibold capitalize ">
                  <span
                    className={`w-2 h-2 animate-pulse rounded-full ${
                      transaction?.data.completed
                        ? "bg-neutral-500"
                        : transaction?.data.status === "done"
                        ? "bg-green-600"
                        : transaction?.data.status === "pending"
                        ? "bg-orange-400"
                        : transaction?.data.status === "processing"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  ></span>
                  {transaction?.data.status}
                </h6>
              </div>

              {transaction?.data.status === "done" ? (
                <div className="border hover:bg-green-100 text-green-600 hover:text-green-600 bg-green-100 border-green-700 grid place-items-center px-2 py-1 rounded-xl first-letter:font-bold grid-flow-col gap-1">
                  <CheckIcon width={14} strokeWidth={3} />
                  Approved
                </div>
              ) : null}
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4">
              <span className="  dark:text-neutral-300 text-[12px]">
                Transaction ID
              </span>
              <h6 className="flex align-middle place-items-center gap-2 font-semibold">
                {transaction?.id || params._id}
              </h6>
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
            <div className="  px-4 flex align-middle place-items-center justify-between">
              <div>
                <span className="  dark:text-neutral-300 text-[12px]">
                  Reference ID
                </span>
                <h6
                  className={`${
                    transaction?.data.status === "done"
                      ? "text-green-600"
                      : "text-red-500"
                  } flex align-middle place-items-center gap-2 font-semibold`}
                >
                  {transaction?.data.status === "done"
                    ? transaction.payment.reference
                    : "N/A"}
                </h6>
              </div>
              {transaction?.data.status === "done" && (
                <Button
                  title="Copy reference ID"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        transaction?.payment?.reference ||
                          "Guy chill na, the app never load 😹😹😹"
                      )
                      .then(() => {
                        setCopied(true);
                      });
                  }}
                  variant={"ghost"}
                  className={`hover:bg-neutral-200 aspect-square p-0 border ${
                    copied
                      ? "bg-purple-300 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-800"
                      : ""
                  }`}
                >
                  {copied ? (
                    <CheckIcon width={15} strokeWidth={2} />
                  ) : (
                    <ClipboardCopyIcon width={15} strokeWidth={2} />
                  )}
                </Button>
              )}
            </div>
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
            {/* Seperator /> */}
          </div>
          <div className="my-6 grid grid-flow-row text-sm divide-y">
            <Link
              href={`/chat/${transaction?.chatId}`}
              className="flex align-middle place-items-center justify-between w-full p-4 border-purple-100 dark:border-neutral-600 dark:border-opacity-40 hover:shadow-sm group text-purple-900"
            >
              <div className="flex align-middle place-items-center justify-between gap-4 dark:text-neutral-300">
                <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-purple-400 bg-purple-100 dark:bg-purple-950 dark:bg-opacity-40 dark:border-purple-700 dark:text-purple-500">
                  <ChatBubbleBottomCenterTextIcon width={22} />
                </div>
                View Conversation
              </div>

              <ChevronRightIcon
                width={22}
                className="group-hover:ml-2 duration-300 ease-in"
              />
            </Link>
            <Link
              href={{
                query: {
                  transactionId: transaction.id,
                  reason: "transactional",
                },
                pathname: "/support",
              }}
              className="flex align-middle place-items-center justify-between w-full p-4 border-red-100 dark:border-neutral-600 dark:border-opacity-40 hover:shadow-sm group text-red-900"
            >
              <div className="flex align-middle place-items-center justify-between gap-4 dark:text-neutral-300">
                <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-red-400 bg-red-100 dark:bg-red-950 dark:bg-opacity-40 dark:border-red-700 dark:text-red-500">
                  <ChatBubbleBottomCenterTextIcon width={22} />
                </div>
                Report Conversation
              </div>

              <ChevronRightIcon
                width={22}
                className="group-hover:ml-2 duration-300 ease-in"
              />
            </Link>
          </div>

          <DownloadReceipt />
        </>
      ) : (
        <TransactionSkeleton />
      )}
    </div>
  );
};

export default TransactionDetail;
