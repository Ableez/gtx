"use client";

import {
  ArrowRightIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import { giftcards } from "@/lib/data/giftcards";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type Props = {
  params: {
    _id: string;
  };
};

const TransactionDetail = ({ params }: Props) => {
  const [transactionData, setTransactionData] = useState<Transaction>();
  const transactionId = params._id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openRef, setOpenRef] = useState({
    open: false,
    referenceId: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "Transactions", transactionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Transaction;
          setTransactionData(data);
          console.log("Document data:", data);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction data", error);
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [transactionId]);

  const card = giftcards.find((card) => {
    return card.name === transactionData?.vendor;
  });

  const subCategory = card?.subCategory.find((sub) => {
    return sub.value === transactionData?.subcategory;
  });

  const date = formatTime(
    new Date(
      (transactionData?.date.seconds ?? 0) * 1000 +
        (transactionData?.date.nanoseconds ?? 0) / 1e6
    ).toISOString()
  );

  const approveTransaction = async () => {
    try {
      const transactionRef = doc(db, "Transactions", transactionId);

      await updateDoc(transactionRef, {
        referenceId: openRef.referenceId,
        isApproved: true,
        status: "done",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelTransaction = async () => {
    try {
      const transactionRef = doc(db, "Transactions", transactionId);

      await updateDoc(transactionRef, {
        isApproved: false,
        status: "cancelled",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="font-bold text-lg relative max-w-screen-sm pb-8">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container">
            <Button
              onClick={() => {
                router.back();
              }}
              variant={"ghost"}
              className="border"
            >
              <ArrowLeftIcon width={20} />
            </Button>
          </div>
          <div className="my-6">
            <div className="flex align-middle place-items-center px-4 w-fit mx-auto gap-4 py-4">
              <Image
                src={"/logoplace.svg"}
                alt="Vendor Logo"
                width={50}
                height={50}
                className="dark:opacity-20"
              />
              {transactionData?.vendor} Card
            </div>
            <p className="text-center text-[12px] text-neutral-400 dark:text-neutral-500 font-medium">
              {transactionData ? date : "Loading date..."}
            </p>
          </div>
          <div className="gri d grid-flow-row divide-y">
            <div className="bg-white dark:bg-neutral-800 px-4 py-2">
              <h4 className="capitalize">{transactionData?.user.username}</h4>
              <span className="font-medium text-[12px]">
                {transactionData?.user.email}
              </span>
            </div>
            <div className="bg-white dark:bg-neutral-800 px-4 py-2">
              <h4 className="">${transactionData?.amount}</h4>
              <span className="font-medium text-[12px] text-neutral-400">
                {subCategory && subCategory.title}
              </span>
            </div>
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 flex align-middle place-items-center justify-between">
              <div>
                <span className="font-medium text-neutral-400 dark:text-neutral-400 text-[12px]">
                  Payment Method
                </span>
                <h4 className="text-[0.8rem]">Transfer</h4>
              </div>
              <div
                className="text-left gap-0 text-[10px] font-medium"
                style={{ lineHeight: "16px" }}
              >
                {transactionData?.payment.details.accountNumber} <br />
                {transactionData?.payment.details.accountName} <br />
                {transactionData?.payment.details.bank}
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 flex align-middle place-items-center justify-between">
              <div>
                <span className="font-medium text-neutral-400 dark:text-neutral-400 text-[12px]">
                  Status
                </span>
                <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem] capitalize">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      transactionData?.isApproved
                        ? "bg-green-400"
                        : transactionData?.status === "done"
                        ? "bg-green-400"
                        : transactionData?.status === "pending"
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                  ></span>
                  {transactionData?.status}
                </h4>
              </div>

              {/* <DropdownMenu>
                <DropdownMenuTrigger className="text-xs bg-purple-300 px-2 py-1.5 rounded-md flex align-middle place-items-center justify-between gap-1">
                  Change <ChevronDownIcon width={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenRef((prev) => {
                        return {
                          ...prev,
                          open: true,
                        };
                      });
                    }}
                  >
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              <Button
                variant={"ghost"}
                disabled={transactionData?.isApproved}
                className="border shadow-none bg-green-400 border-green-600 hover:bg-green-400 hover:border-green-900 disabled:bg-green-100 disabled:text-green-700 dark:disabled:bg-green-950 dark:disabled:text-green-100 hover:shadow-inner inset-x-4 inset-y-2"
                onClick={() => {
                  setOpenRef((prev) => {
                    return {
                      ...prev,
                      open: true,
                    };
                  });
                }}
              >
                {transactionData?.isApproved ? "Approved" : "Approve"}
              </Button>
            </div>

            <Dialog open={openRef.open}>
              <DialogContent>
                <DialogClose
                  onClick={() => {
                    setOpenRef((prev) => {
                      return {
                        ...prev,
                        open: false,
                      };
                    });
                  }}
                  className="absolute top-3 right-4 bg-white dark:bg-neutral-800 p-2.5 border rounded-md z-50"
                >
                  <XMarkIcon width={18} />
                </DialogClose>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    approveTransaction();
                  }}
                  className="pb-6 pt-8 grid gap-3"
                >
                  <DialogDescription className="text-xs leading-6">
                    Enter the transfer reference Id to approve transaction
                  </DialogDescription>
                  <Input
                    placeholder="Reference ID"
                    className="shadow-none"
                    onChange={(e) => {
                      setOpenRef((prev) => {
                        return {
                          ...prev,
                          referenceId: e.target.value,
                        };
                      });
                    }}
                  />
                  {error && error}
                  <Button
                    disabled={openRef.referenceId.split("").length < 10}
                    onClick={() => {
                      setOpenRef((prev) => {
                        return {
                          ...prev,
                          open: false,
                        };
                      });
                    }}
                  >
                    Approve
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="bg-white dark:bg-neutral-800 px-4 py-2">
              <span className="font-medium text-neutral-400 dark:text-neutral-400 text-[12px]">
                Transaction ID
              </span>
              <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem]">
                {transactionData?.link || params._id}
              </h4>
            </div>
            <div className="bg-white dark:bg-neutral-800 px-4 py-2">
              <span className="font-medium text-neutral-400 dark:text-neutral-400 text-[12px]">
                Reference ID
              </span>
              <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem]">
                {transactionData?.isApproved
                  ? transactionData.referenceId
                  : "N/A"}
              </h4>
            </div>
          </div>
          <div className="my-6 grid grid-flow-row gap-1 text-sm">
            <Link
              href={`/admin/chat/${transactionData?.chatId}`}
              className="flex align-middle place-items-center justify-between w-full p-4 bg-white dark:bg-neutral-800 border-y border-purple-100 dark:border-neutral-600 dark:border-opacity-40 hover:shadow-sm group text-purple-900"
            >
              <div className="flex align-middle place-items-center justify-between gap-4 dark:text-neutral-400">
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
            <Dialog
              onOpenChange={(e) => {
                console.log(e);
                if (e === false) {
                  setError("");
                }
              }}
            >
              <DialogTrigger className="flex align-middle place-items-center justify-between w-full p-4 bg-white dark:bg-neutral-800 border-y border-pink-100 dark:border-neutral-600 dark:border-opacity-40 hover:shadow-sm group text-orange-700">
                <div className="flex align-middle place-items-center justify-between gap-4">
                  <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-red-400 bg-red-100 dark:bg-red-950 dark:bg-opacity-40 dark:border-red-700 dark:text-red-500">
                    <TrashIcon width={22} />
                  </div>
                  Cancel transaction
                </div>

                <ChevronRightIcon
                  width={22}
                  className="group-hover:ml-2 duration-300 ease-in"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h4 className="font-semibold text-neutral-800">
                    Are you sure?
                  </h4>
                </DialogHeader>
                <DialogDescription className="text-center">
                  Cancel the transaction
                </DialogDescription>
                <div className="flex align-middle justify-between gap-3">
                  <DialogClose
                    className="w-full shadow-none bg-primary rounded-md py-2.5 font-medium text-white"
                    onClick={() => cancelTransaction()}
                  >
                    Okay
                  </DialogClose>
                  <DialogClose className="w-full shadow-none border rounded-md py-2.5 font-medium">
                    Cancel
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetail;
