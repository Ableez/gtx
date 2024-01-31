/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  BaseSyntheticEvent,
  useRef,
} from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/utils/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LinkIcon,
  PaperAirplaneIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { giftcards } from "@/lib/data/giftcards";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// types
type Message = {
  id: string;
  user: {
    email: string;
    uid: string;
    username: string;
  };
  messages: {
    sender: string;
    text: string;
    sent_at: Date;
    media: string;
  }[];
  lastMessage: {
    timeStamp: {
      seconds: number;
      nanoseconds: number;
    };
    media: boolean;
    text: string;
  };
  transactions: string[];
  transactionPrompted: boolean;
  transactionStarted: boolean;
};

type Props = {
  params: {
    chatId: string;
  };
};

export type TransactionData = {
  link: string;
  product: string;
  subcategory: string;
  vendor: string;
  amount: number;
  status: string;
  isApproved: boolean;
  payment: {
    saved: boolean;
    method: string;
    details: {
      accountName: string;
      accountNumber: string;
      bank: string;
    };
  };
  date: Date;
};

type AccountDetails = {
  accountName: string;
  accountNumber: string;
  bank: string;
};

const allGiftcards = giftcards;

const UserChatScreen = ({ params }: Props) => {
  const isInitialRender = useRef(true);
  const [messages, setMessages] = useState<Message>();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [transactionData, setTransactionData] = useState<TransactionData>({
    link: "",
    product: "giftcard",
    subcategory: "",
    vendor: "",
    amount: 0,
    status: "pending",
    isApproved: false,
    payment: {
      saved: false,
      method: "transfer",
      details: {
        accountName: "",
        accountNumber: "",
        bank: "",
      },
    },
    date: new Date(),
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [waitForDetails, setWaitForDetails] = useState(false);
  const [transactionDetails, setTransactionDetails] =
    useState<AccountDetails>();
  const [openT, setOpenT] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState({
    open: false,
    url: "",
  });
  // refs
  const textRef = useRef<HTMLDivElement>(null);
  const chatsAutoScroll = useRef<HTMLDivElement>(null);

  const fetchChatData = useCallback(async () => {
    try {
      const chatDocRef = doc(db, "Messages", params.chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const chatData = chatDocSnap.data() as Message;
        setMessages(chatData);
      } else {
        console.error("Error: Chat document not found");
        router.push("/admin/chat");
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      router.push("/sell");
    }
  }, [params.chatId, router, setMessages]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        fetchChatData().then(() => {
          if (chatsAutoScroll.current) {
            chatsAutoScroll.current.scrollTop =
              chatsAutoScroll.current.scrollHeight;
          }
        });
      }
    );

    return () => unsubscribe();
  }, [params.chatId, fetchChatData]);

  // listen for transaction details
  const checkTransaction = useCallback(async () => {
    if (messages && messages.transactionStarted === true) {
      const transactions = messages.transactions;
      const transactionId = transactions[transactions.length - 1];

      const docRef = doc(db, "Transactions", transactionId);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          console.log("Current transaction data: ", doc.data());
          setTransactionDetails(doc.data().payment.details);
        } else {
          console.log("Could not find user's account information");
        }
      });

      return () => {
        unsubscribe();
      };
    } else {
      console.log("No transactions available yet!");
    }
  }, [messages]);

  useEffect(() => {
    if (!isInitialRender.current) {
      checkTransaction();
    } else {
      isInitialRender.current = false;
    }
  }, [checkTransaction]);

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    setCurrentMessage(value);
  };

  const sendMessage = async () => {
    try {
      if (currentMessage === "") {
        return;
      }

      const newMessage = {
        sender: "admin",
        text: currentMessage,
        sent_at: new Date(),
        media: "",
      };

      messages?.messages.push(newMessage);

      setCurrentMessage("");
      const messagesRef = doc(db, "Messages", params.chatId);

      // Update the messages array and lastMessage fields
      await updateDoc(messagesRef, {
        messages: arrayUnion({
          sender: "admin",
          text: currentMessage,
          sent_at: new Date(),
          media: "",
        }),
        lastMessage: {
          timeStamp: new Date(),
          media: false,
          text: currentMessage,
        },
      });

      setCurrentMessage(""); // Clear the input after sending the message
      fetchChatData();
    } catch (error) {
      console.error(error);
    }
  };

  const submitTransaction = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    // Update the transactionData object with the form data
    setTransactionData((prev) => {
      return {
        ...prev,
        status: "pending",
        isApproved: false,
        date: new Date(),
      };
    });

    if (
      transactionData.amount < 3 ||
      transactionData.vendor === "" ||
      transactionData.subcategory === ""
    ) {
      setError("Please fill in all fields");
      return;
    }

    const tdat = {
      ...transactionData,
      chatId: params.chatId,
    };

    try {
      const transactionsRef = collection(db, "Transactions");

      const createdTransaction = await addDoc(transactionsRef, {
        ...tdat,
        user: messages?.user,
      });

      // Update the messages document to append the transaction id, and trigger transaction process
      const messagesRef = doc(db, "Messages", params.chatId);
      await updateDoc(messagesRef, {
        transactions: arrayUnion(createdTransaction.id),
        transactionPrompted: true,
      });

      setWaitForDetails(true);
      setLoading(false);

      // Close the dialog
      // router.push("/sell");
    } catch (error) {
      console.log("Error starting Transaction", error);
      setLoading(false);
    }
  };

  // copy account number to clip board

  const copyToClipboard = async () => {
    try {
      const textToCopy = textRef?.current?.innerText;

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);

        alert(textToCopy);
      } else {
        console.error("Text content is undefined or empty");
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  // MESSAGES
  const renderMessages = () => {
    return messages?.messages.map((message, idx) => {
      return (
        <div
          key={idx}
          className={`flex leading-5 mb-6 ${
            message.sender !== "admin" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`${
              message.sender !== "admin"
                ? " bg-secondary text-white  dark:text-white rounded-r-lg rounded-bl-lg rounded-tl-[4px]"
                : "dark:bg-neutral-700 bg-white text-black dark:text-white rounded-l-lg rounded-br-lg rounded-tr-[3px]"
            } relative max-w-[320px] md:max-w-[564px] ${
              message.media
                ? "px-1 py-1 dark:bg-neutral-800 dark:hover:shadow-lg dark:hover:shadow-neutral-900"
                : "px-3 py-1.5"
            } text-neutral-800 break-words text-sm overflow-x-hidden duration-300`}
          >
            {message.media !== "" ? (
              <>
                <img
                  src={
                    message.media && typeof message.media === "string"
                      ? message.media
                      : "/logoplace.svg"
                  }
                  alt=""
                  width={160}
                  height={160}
                  onClick={() => {
                    setView((prev) => {
                      return {
                        ...prev,
                        open: true,
                        url: message.media,
                      };
                    });
                  }}
                  className="rounded-md w-auto h-auto min-h-max hover:scale-[1.024] duration-200 cursor-pointer"
                />
              </>
            ) : (
              <span className="block">{message.text}</span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="overflow-hidden duration-300">
      <div
        className="space-y-2 py-24 px-4 h-screen overflow-scroll border"
        ref={chatsAutoScroll}
      >
        {renderMessages()}
      </div>
      <AlertDialog open={view.open}>
        <AlertDialogContent className="pt-16">
          <AlertDialogCancel
            className="w-fit absolute top-0 right-3 dark:bg-neutral-800"
            onClick={() => {
              setView((prev) => {
                return {
                  ...prev,
                  open: false,
                };
              });
            }}
          >
            <XMarkIcon width={20} />
          </AlertDialogCancel>
          <img
            src={
              view.url && typeof view.url === "string"
                ? view.url
                : "/logoplace.svg"
            }
            alt="Giftcard image"
            width={800}
            height={800}
          />
        </AlertDialogContent>
      </AlertDialog>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex py-2 fixed bottom-0 w-full place-items-center justify-center gap-1 px-4 z-[999] bg-neutral-100 dark:bg-neutral-800 border-t dark:border-neutral-600"
      >
        <div className="bg-neutral-50 dark:bg-neutral-800 dark:border dark:border-neutral-600 w-full flex align-middle place-items-center rounded-3xl px-2">
          <Input
            value={currentMessage}
            onChange={(e) => handleInputChange(e)}
            placeholder="Send message..."
            className="rounded-full py-6 shadow-none focus-visible:ring-0 text-[16px] font-semibold border-none dark:text-white text-neutral-800 "
          />

          <Dialog open={openT}>
            <DialogTrigger className="p-2" onClick={() => setOpenT(true)}>
              <CurrencyDollarIcon width={25} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] rounded-xl z-[99999] bg-neutral-700">
              <DialogClose
                onClick={() => {
                  setOpenT(false);
                }}
                className="border rounded-md p-3 absolute top-2 right-3 bg-neutral-800 z-50"
              >
                <XMarkIcon width={18} />
              </DialogClose>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitTransaction(e);
                }}
              >
                <DialogHeader>
                  <DialogTitle>Start a transaction</DialogTitle>
                  <DialogDescription>Enter details below</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 grid-flow-row">
                  <div>
                    <label
                      htmlFor="cardvendor"
                      className="text-neutral-400 text-xs"
                    >
                      Card:
                    </label>
                    <select
                      required
                      onChange={(e) =>
                        setTransactionData((prev) => {
                          return {
                            ...prev,
                            vendor: e.target.value,
                          };
                        })
                      }
                      id="cardvendor"
                      className="w-full py-4 rounded-xl px-4 first:text-neutral-400 focus-within:outline-none bg-neutral-100 dark:bg-neutral-800 font-semibold"
                    >
                      <option className="text-neutral-500 placeholder:text-neutral-300 dark:text-neutral-400 ">
                        Select card...
                      </option>
                      {allGiftcards.map((card, idx) => (
                        <option key={idx} value={card.name}>
                          {card.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="subcategory"
                      className="text-neutral-400 text-xs"
                    >
                      Subcategory:
                    </label>
                    <select
                      required
                      onChange={(e) =>
                        setTransactionData((prev) => {
                          return {
                            ...prev,
                            subcategory: e.target.value,
                          };
                        })
                      }
                      id="subcategory"
                      className="w-full py-4 rounded-xl px-4 first:text-neutral-400 focus-within:outline-none bg-neutral-100 dark:bg-neutral-800 font-semibold placeholder:text-neutral-400"
                    >
                      <option className="placeholder:text-neutral-500  dark:text-neutral-400 ">
                        Select subcategory...
                      </option>
                      {allGiftcards
                        .find((card) => card.name === transactionData.vendor)
                        ?.subCategory.map((sub, idx) => {
                          return (
                            <option key={idx} value={sub.value}>
                              {sub.title}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="text-neutral-400 text-xs"
                    >
                      Amount in USD
                    </label>
                    <input
                      required
                      type="number"
                      id="amount"
                      placeholder="Enter card price..."
                      className="w-full py-4 rounded-xl px-4 focus-within:outline-none bg-neutral-100 dark:bg-neutral-800 font-semibold placeholder:text-neutral-400"
                      onChange={(e) =>
                        setTransactionData((prev) => {
                          return {
                            ...prev,
                            amount: parseInt(e.target.value),
                          };
                        })
                      }
                    />
                  </div>
                </div>
                <p className="text-xs text-neutral-400">{error || null}</p>
                <DialogFooter className="mt-4">
                  <Button type="submit" className="py-6" disabled={loading}>
                    Start
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={waitForDetails}>
            <AlertDialogContent>
              <div className="text-left">
                <h4 className="text-lg font-bold text-center mx-auto">
                  {transactionDetails?.accountName ? (
                    "Account Details"
                  ) : (
                    <div>
                      <h4>Waiting for customer</h4>
                      <p className="text-xs text-neutral-700 leading-6 font-medium">
                        Do not refresh the page*
                      </p>
                    </div>
                  )}
                </h4>

                <div className="mt-6 dark:bg-neutral-900">
                  <dl className="divide-y divide-neutral-100 dark:divide-neutral-600 px-4">
                    <div className="py-4 flex gap-3">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400">
                        Account Name
                      </dt>
                      <dd className="mt-1 text-sm leading-4 text-neutral-700 dark:text-neutral-500">
                        {transactionDetails?.accountName || (
                          <SunIcon
                            width={18}
                            className="text-neutral-300 dark:text-neutral-400 animate-spin"
                          />
                        )}
                      </dd>
                    </div>
                    <div className="py-4 flex gap-3">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400">
                        Account Number
                      </dt>
                      <div
                        ref={textRef}
                        className="mt-1 text-sm leading-4 text-neutral-700 dark:text-neutral-500"
                      >
                        {transactionDetails?.accountNumber || (
                          <SunIcon
                            width={18}
                            className="text-neutral-300 dark:text-neutral-400 animate-spin"
                          />
                        )}
                      </div>
                    </div>
                    <div className="py-4 flex gap-3 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400">
                        Bank Name
                      </dt>
                      <dd className="mt-1 text-sm leading-4 text-neutral-700 dark:text-neutral-500">
                        {transactionDetails?.bank || (
                          <SunIcon
                            width={18}
                            className="text-neutral-300 dark:text-neutral-400 animate-spin"
                          />
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <Button
                  className="w-full mt-5"
                  disabled={transactionDetails?.accountName ? false : true}
                  onClick={async () => {
                    const messagesRef = doc(db, "Messages", params.chatId);
                    // close transaction process
                    await updateDoc(messagesRef, {
                      transactionPrompted: false,
                      transactionStarted: false,
                    });
                    copyToClipboard();
                    setWaitForDetails(false);
                    setOpenT(false);
                    setTransactionDetails({
                      accountName: "",
                      accountNumber: "",
                      bank: "",
                    });
                  }}
                >
                  Okay Copy
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Button
          className="h-full rounded-3xl py-2.5"
          onClick={() => sendMessage()}
          variant={"ghost"}
        >
          <PaperAirplaneIcon width={28} />
        </Button>
      </form>
    </div>
  );
};

export default UserChatScreen;
