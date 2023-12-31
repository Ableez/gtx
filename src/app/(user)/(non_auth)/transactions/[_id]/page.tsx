"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import Loading from "@/app/loading";
import { giftcards } from "@/lib/data/giftcards";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    _id: string;
  };
};

type PaymentDetails = {
  accountName: string;
  accountNumber: string;
  bank: string;
};

type DateObject = {
  seconds: number;
  nanoseconds: number;
};

type User = {
  email: string;
  username: string;
  uid: string;
};

type Transaction = {
  chatId: string;
  user: User;
  link: string;
  isApproved: boolean;
  product: string;
  vendor: string;
  date: DateObject;
  amount: number;
  payment: {
    details: PaymentDetails;
  };
  subcategory: string;
  status: string;
};

const TransactionDetail = ({ params }: Props) => {
  const [transactionData, setTransactionData] = useState<Transaction>();
  const transactionId = params._id;
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    subject: "",
    body: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const sendReports = async () => {
    setError("");
    try {
      setLoading(true);
      if (reportData.subject === "" || reportData.body === "") {
        setError("Please fill in all fields");
        return;
      }

      const reportRef = collection(db, "Reports");
      await addDoc(reportRef, {
        cause: "transaction",
        type: "report",
        details: {
          subject: reportData.subject,
          body: reportData.body,
        },
        date: new Date(),
        user: {
          uid: localStorage.getItem("uid") || auth.currentUser?.uid,
          username: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
        },
        data: {
          ...transactionData,
          transactionId: transactionId,
        },
        read: false,
      });
      setLoading(false);
    } catch (error) {
      console.log("Error sending report", error);
      setError("An error occured while sending report");
      setLoading(false);
    }
  };

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

  return (
    <div className="font-bold text-lg relative max-w-screen-md mx-auto">
      <nav className="bg-white shadow flex align-middle place-items-center justify-between px-4 py-2 border-b border-b-neutral-300 sticky top-0">
        <div className="flex align-middle justify-between place-items-center gap-2">
          <Button
            variant={"ghost"}
            onClick={() => {
              router.back();
            }}
            className="border rounded-lg text-neutral-800 shadow-none bg-neutral-100 dark:bg-neutral-700 p-3"
          >
            <ArrowLeftIcon width={20} />
          </Button>
          <h4 className="text-center mx-auto">Transaction</h4>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="bg-primary py-2 px-4 text-sm text-white rounded-lg shadow shadow-primary/40 focus-within:outline-none">
            Share
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <div className="grid grid-flow-row gap-3">
              <DropdownMenuItem>Image</DropdownMenuItem>
              <DropdownMenuItem>PDF</DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      {loading ? (
        <Loading />
      ) : (
        <>
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
            <p className="text-center text-[12px] text-neutral-400 font-medium">
              {transactionData ? date : "Loading date..."}
            </p>
          </div>
          <div className="gri d grid-flow-row divide-y">
            <div className="bg-white px-4 py-2">
              <h4 className="">${transactionData?.amount}</h4>
              <span className="font-medium text-[12px]">
                {subCategory && subCategory.title}
              </span>
            </div>
            <div className="bg-white px-4 py-2 flex align-middle place-items-center justify-between">
              <div>
                <span className="font-medium text-neutral-400 text-[12px]">
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
            <div className="bg-white px-4 py-2">
              <span className="font-medium text-neutral-400 text-[12px]">
                Status
              </span>
              <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem] capitalize">
                <span
                  className={`w-3 h-3 rounded-full ${
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
            <div className="bg-white px-4 py-2">
              <span className="font-medium text-neutral-400 text-[12px]">
                Transaction ID
              </span>
              <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem]">
                {transactionData?.link || params._id}
              </h4>
            </div>
            <div className="bg-white px-4 py-2">
              <span className="font-medium text-neutral-400 text-[12px]">
                Reference ID
              </span>
              <h4 className="flex align-middle place-items-center gap-2 text-[0.8rem]">
                {transactionData?.isApproved
                  ? transactionData?.referenceId
                  : "N/A"}
              </h4>
            </div>
          </div>
          <div className="my-6 grid grid-flow-row gap-1 text-sm">
            <Link
              href={`/chat/${transactionData?.chatId}`}
              className="flex align-middle place-items-center justify-between w-full p-4 bg-white border-y border-purple-100 hover:shadow-sm group text-purple-900"
            >
              <div className="flex align-middle place-items-center justify-between gap-4">
                <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-purple-400 bg-purple-100">
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
              <DialogTrigger
                onClick={async () => {
                  try {
                    const reportRef = query(
                      collection(db, "Reports"),
                      where("transactionId", "==", transactionId)
                    );
                    const docSnap = await getDocs(reportRef);
                    if (!docSnap.empty) {
                      setError("You have already reported this transaction");
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="flex align-middle place-items-center justify-between w-full p-4 bg-white border-y border-pink-100 hover:shadow-sm group text-orange-700"
              >
                <div className="flex align-middle place-items-center justify-between gap-4">
                  <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-pink-400 bg-pink-100">
                    <InformationCircleIcon width={22} />
                  </div>
                  Report Conversation
                </div>

                <ChevronRightIcon
                  width={22}
                  className="group-hover:ml-2 duration-300 ease-in"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h4 className="font-semibold text-neutral-800">
                    Report Transaction
                  </h4>
                </DialogHeader>
                <DialogDescription>
                  <p className="text-sm leading-6 text-gray-600 text-center">
                    Hey{" "}
                    <span className="capitalize">
                      {auth.currentUser?.displayName}
                    </span>{" "}
                    Tell us the problem
                  </p>
                </DialogDescription>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendReports();
                  }}
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Subject
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <Input
                            type="text"
                            name="subject"
                            id="subject"
                            className="block flex-1 border-0 bg-transparent  text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Subject"
                            onChange={(e) => {
                              setReportData({
                                ...reportData,
                                subject: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="reportBody"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Whats the problem?
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="reportBody"
                          name="reportBody"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-2"
                          defaultValue={""}
                          onChange={(e) => {
                            setReportData({
                              ...reportData,
                              body: e.target.value,
                            });
                          }}
                        />
                      </div>
                      {reportData.body.split(" ").length < 3 && (
                        <p className="text-neutral-500 text-xs">
                          Minimum 3 words
                        </p>
                      )}
                    </div>
                    {error && (
                      <div className="col-span-full">
                        <p className="text-xs text-center text-red-500">
                          {error}
                        </p>
                      </div>
                    )}

                    <div className="col-span-full">
                      <Button
                        disabled={
                          reportData.subject.length === 0 ||
                          reportData.body.split(" ").length < 3
                        }
                        className="w-full"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-10 text-center font-light text-[0.6em]">
            Please read our{" "}
            <Link href={"/"} className=" text-secondary">
              terms and conditions
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetail;
