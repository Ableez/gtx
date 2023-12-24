/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useEffect,
  useState,
  useCallback,
  BaseSyntheticEvent,
  useRef,
} from "react";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  query,
  collection,
  getDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, storage } from "@/lib/utils/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckBadgeIcon,
  LinkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { TransactionData } from "@/app/(admin)/admin/(non-auth)/chat/[chatId]/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { FirebaseError } from "firebase/app";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SuccessCheckmark from "@/components/successMark";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

// types
type Props = {
  params: {
    chatId: string;
  };
};

type SavedPayment = {
  accountName: string;
  accountNumber: string;
  bank: string;
};

const UserChatScreen = ({ params }: Props) => {
  // STATES
  const [messages, setMessages] = useState<Message>();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [promptTransaction, setPromptTransaction] = useState<boolean>(false);
  const [accountDetails, setAccountDetails] = useState({
    accountName: "",
    accountNumber: "",
    bank: "",
  });
  const [promptWait, setWaitPrompt] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([]);
  const [hasSavedPayments, setHasSavedPayments] = useState<boolean>();
  const [shouldSave, setShouldSave] = useState(false);
  const [useSaved, setUseSaved] = useState(false);
  const [selected, setSelected] = useState<SavedPayment>({
    accountName: "",
    accountNumber: "",
    bank: "",
  } as SavedPayment);
  const chatsAutoScroll = useRef<HTMLDivElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState({
    open: false,
    url: "",
  });

  // UTIL
  const router = useRouter();

  // HELPER FUNCTIONS

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
            chatsAutoScroll.current.scrollTo({
              top: chatsAutoScroll.current.scrollHeight + 400,
              behavior: "smooth",
            });
          }
        });
      }
    );

    return () => unsubscribe();
  }, [params.chatId, fetchChatData]);

  const checkTransaction = useCallback(async () => {
    const q = query(collection(db, "Transactions"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactions = [] as TransactionData[];
      querySnapshot.forEach((doc) => {
        transactions.push(doc.data() as TransactionData);
      });
      setPromptTransaction(true);
      console.log("Current transactions", transactions);
    });

    return () => unsubscribe();
  }, []);

  const checkUser = useCallback(async () => {
    const docRef = doc(db, "Users", auth.currentUser?.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().savedPayments === true) {
      setHasSavedPayments(true);
      setSavedPayments(docSnap.data().payment);
    } else {
      setHasSavedPayments(false);
    }
  }, []);

  const savePaymentDetails = async () => {
    const docRef = doc(
      db,
      "Users",
      auth?.currentUser?.uid ||
        JSON.parse(localStorage.getItem("uid") as string)
    );

    if (useSaved) {
      if (
        selected.accountName === "" ||
        selected.accountNumber === "" ||
        selected.bank === ""
      ) {
        console.log("not saved!!");
        return;
      }
    } else if (
      !useSaved &&
      (accountDetails.accountNumber === "" ||
        accountDetails.accountName === "" ||
        accountDetails.bank === "")
    ) {
      console.log("not saved!!");
      return;
    }
    // Update the messages array and lastMessage fields
    // check if the account number already exists in the firestore data base
    const q = query(
      collection(db, "Users"),
      where("payment.accountNumber", "==", accountDetails.accountNumber)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      setError("Account number already exists");
      console.log(querySnapshot.docs);
      return;
    }

    await updateDoc(docRef, {
      savedPayments: true,
      payment: arrayUnion({
        accountName: accountDetails.accountName,
        accountNumber: accountDetails.accountNumber,
        bank: accountDetails.bank,
      }),
    });
  };

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    setCurrentMessage(value);
  };

  const sendMessage = async (media?: string) => {
    try {
      if (currentMessage === "") {
        return;
      }

      setCurrentMessage("");
      const messagesRef = doc(db, "Messages", params.chatId);

      // Update the messages array and lastMessage fields
      await updateDoc(messagesRef, {
        messages: arrayUnion({
          sender: auth.currentUser?.uid,
          text: media ? "" : currentMessage,
          sent_at: new Date(),
          media: media || "",
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

  const sendFile = async (media?: string) => {
    try {
      if (media === "") {
        return;
      }
      const messagesRef = doc(db, "Messages", params.chatId);

      // Update the messages array and lastMessage fields
      await updateDoc(messagesRef, {
        messages: arrayUnion({
          sender: auth.currentUser?.uid,
          text: media,
          sent_at: new Date(),
          media: media,
        }),
        lastMessage: {
          timeStamp: new Date(),
          media: true,
          text: "mdia__xyl",
          sender: auth.currentUser?.displayName,
        },
      });

      setUploadedImageUrl(""); // Clear the input after sending the message
      await fetchChatData();
    } catch (error) {
      console.error(error);
    }
  };

  const sendAccountDetails = async () => {
    try {
      const messagesRef = doc(db, "Messages", params.chatId);

      const transactionId =
        messages?.transactions[messages?.transactions.length - 1];

      const transactionRef = doc(db, "Transactions", transactionId);

      if (useSaved) {
        if (selected.accountName === "" || selected.accountNumber === "") {
          setError("Select a saved account");
          return;
        }
      } else if (
        accountDetails.accountName === "" ||
        accountDetails.accountNumber === "" ||
        accountDetails.bank === ""
      ) {
        setError("All fields are required");
        return;
      }

      if (useSaved) {
        await updateDoc(transactionRef, {
          payment: {
            details: selected,
          },
        });
      } else if (!useSaved) {
        await updateDoc(transactionRef, {
          payment: {
            details: {
              accountName: accountDetails.accountName,
              accountNumber: accountDetails.accountNumber,
              bank: accountDetails.bank,
            },
          },
        });
      }

      // check if the saveInfo checkbox is checked. if checked run savePayment function
      if (shouldSave) {
        savePaymentDetails();
      }

      // close transaction process
      await updateDoc(messagesRef, {
        transactionPrompted: false,
        transactionStarted: true,
      });
      setPromptTransaction(false);
      setWaitPrompt(true);

      setAccountDetails({
        accountName: "",
        accountNumber: "",
        bank: "",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.code, error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const uploadFile = async (e: BaseSyntheticEvent) => {
    const storageRef = ref(storage, `/cardImages/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError("Error uploading file");
        console.log("Error uploading file", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUploadedImageUrl(url);
          sendFile(url);
          setUploadProgress(0);
        });
      }
    );
  };

  // useEffect Hooks
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        const dat = doc.data() as Message;
        if (dat?.transactionPrompted) {
          setPromptTransaction(true);
        }
      }
    );
    return () => unsubscribe();
  }, [params.chatId]);

  useEffect(() => {
    fetchChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages?.transactionPrompted === true) {
      // checkTransaction();
      return;
    } else {
      setPromptTransaction(false);
    }
  }, [checkTransaction, messages]);

  useEffect(() => {
    if (promptTransaction) {
      checkUser();
    }
  }, [checkUser, promptTransaction]);

  // RENDER MESSAGES BUBBLES
  const renderMessages = () => {
    return messages?.messages.map((message, idx) => {
      return (
        <li
          key={idx}
          className={`flex leading-5 ${
            message.sender === "admin" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`${
              message.sender === "admin"
                ? " bg-secondary text-white rounded-r-lg rounded-bl-lg rounded-tl-[4px]"
                : "dark:bg-neutral-700 bg-white text-black dark:text-white rounded-l-lg rounded-br-lg rounded-tr-[4px]"
            } relative max-w-[320px] md:max-w-[564px] ${
              message.media
                ? "px-1 py-1 dark:bg-neutral-800 dark:hover:shadow-lg dark:hover:shadow-neutral-900"
                : "px-3 py-1.5"
            } text-neutral-800 break-words text-sm overflow-x-hidden duration-300`}
          >
            {message.media !== "" ? (
              <>
                <img
                  src={message.media}
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
        </li>
      );
    });
  };

  // RENDER SCREEEN UI
  return (
    <div
      className="overflow-scroll h-screen will-change-scroll duration-300"
      ref={chatsAutoScroll}
    >
      <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 py-4 mt-20 px-8 leading-4">
        Secure your transaction & chat directly with our expert agents. Get
        real-time guidance, resolve issues seamlessly, & share your feedback -
        all within this chat. Let&apos;s make your transaction smooth &
        hassle-free!
      </p>
      <ul className="space-y-2 px-4 mt-8 mb-24">{renderMessages()}</ul>

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
          <img src={view.url} alt="Giftcard image" width={800} height={800} />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={promptTransaction}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-base font-semibold text-neutral-800 dark:text-white">
            Account Details
          </AlertDialogHeader>
          <div className="flex align-middle place-items-center gap-3">
            {hasSavedPayments ? (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    name="saveInfo"
                    onCheckedChange={(v) => {
                      setUseSaved(v);
                    }}
                    id="savedInfo"
                  />
                  <Label htmlFor="savedInfo">Use saved info</Label>
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-700 leading-6">
                Save your account information for quick processing
              </p>
            )}
          </div>
          {useSaved ? (
            <div>
              <p className="text-xs text-neutral-400 font-medium pb-2">
                Select a saved account
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendAccountDetails();
                }}
              >
                <div className="grid gap-3 max-h-[250px] overflow-y-auto overscroll-contain pr-2">
                  {savedPayments?.map((detail, idx) => {
                    return (
                      <div
                        onClick={() => {
                          setSelected((prev) => {
                            if (
                              prev.accountNumber === detail?.accountNumber &&
                              prev.accountName === detail?.accountName &&
                              prev.bank === detail.bank
                            ) {
                              return {
                                accountName: "",
                                accountNumber: "",
                                bank: "",
                              };
                            } else {
                              return {
                                accountName: detail?.accountName,
                                accountNumber: detail?.accountNumber,
                                bank: detail?.bank,
                              };
                            }
                          });
                        }}
                        key={idx}
                        className={`p-2 pl-4 cursor-pointer border-2 ${
                          selected?.accountName === detail?.accountName
                            ? "border-secondary hover:bordeer-secondary dark:text-white"
                            : "border-transparent hover:border-pink-200 dark:hover:border-purple-600/25 dark:text-white"
                        } rounded-md hover:bg-neutral-50 duration-300 relative  dark:hover:bg-neutral-800`}
                      >
                        <h4 className="text-xs text-neutral-800 font-medium dark:text-white">
                          {detail?.accountName}
                        </h4>
                        <div className="flex align-middle place-items-center gap-2 pt-1 text-xs text-neutral-400">
                          <span>{detail?.accountNumber}</span>
                          <span>·</span>
                          <span>{detail?.bank}</span>
                        </div>

                        {selected?.accountName === detail?.accountName && (
                          <CheckBadgeIcon
                            width={20}
                            className="text-secondary absolute right-4 top-1/2 -translate-y-1/2"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button
                  disabled={selected.accountNumber === ""}
                  className="mt-2 w-full"
                >
                  Continue
                </Button>
              </form>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendAccountDetails();
              }}
              className="grid gap-2"
            >
              <p className="text-xs text-neutral-400">Fill your bank details</p>

              <div className="grid gap-2">
                <Input
                  onChange={(e) => {
                    setAccountDetails((prev) => {
                      return {
                        ...prev,
                        accountNumber: e.target.value.toString(),
                      };
                    });
                  }}
                  type="number"
                  placeholder="Account Number"
                  maxLength={11}
                />
                <Input
                  onChange={(e) => {
                    setAccountDetails((prev) => {
                      return {
                        ...prev,
                        accountName: e.target.value,
                      };
                    });
                  }}
                  placeholder="Account Name"
                />
                <Input
                  onChange={(e) => {
                    setAccountDetails((prev) => {
                      return {
                        ...prev,
                        bank: e.target.value,
                      };
                    });
                  }}
                  placeholder="Bank Name"
                />
                <div className="flex align-middle place-items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    className="p-2"
                    onChange={(e) => {
                      setShouldSave(e.target.checked);
                    }}
                  />
                  <label
                    className="text-xs font-medium text-neutral-600"
                    htmlFor="saveInfo"
                  >
                    Save your Account details
                  </label>
                </div>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button
                disabled={
                  accountDetails.accountName === ""
                    ? true
                    : accountDetails.accountNumber === ""
                    ? true
                    : accountDetails.bank === ""
                    ? true
                    : false
                }
                onClick={() => {
                  savePaymentDetails();
                }}
                className="mt-2"
              >
                Continue
              </Button>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={promptWait}>
        <AlertDialogContent className="text-center">
          <div>
            <SuccessCheckmark />
          </div>
          <h4 className="text-sm font-semibold leading-6 text-neutral-900 dark:text-neutral-400">
            You will receive your payments in few minutes
          </h4>
          <p className="text-xs mx-8 leading-4 text-neutral-700 bg-purple-100 dark:bg-purple-700 dark:bg-opacity-40 dark:text-purple-200 p-3 rounded-xl">
            Send us a message or a report If you entered wrong details
          </p>

          <Button
            onClick={async () => {
              const messagesRef = doc(db, "Messages", params.chatId);
              if (useSaved) {
                await updateDoc(messagesRef, {
                  messages: arrayUnion({
                    sender: auth.currentUser?.uid,
                    text: `Account Name: ${selected.accountName} \t 
                    Account Number: ${selected.accountNumber} \t
                  Bank Name: ${selected.bank}`,
                    sent_at: new Date(),
                    media: "",
                  }),
                  lastMessage: {
                    timeStamp: new Date(),
                    media: false,
                    text: currentMessage,
                  },
                });

                console.log("SAVED", {
                  accountName: selected.accountName,
                  accountNumber: selected.accountNumber,
                  bank: selected.bank,
                });

                setUseSaved(false);
              } else {
                await updateDoc(messagesRef, {
                  messages: arrayUnion({
                    sender: auth.currentUser?.uid,
                    text: `Account Name: ${accountDetails.accountName} \t Account Number: ${accountDetails.accountNumber} \t
                  Bank Name: ${accountDetails.bank}`,
                    sent_at: new Date(),
                    media: "",
                  }),
                  lastMessage: {
                    timeStamp: new Date(),
                    media: false,
                    text: currentMessage,
                  },
                });

                console.log("NOT SAVED", {
                  accountName: accountDetails.accountName,
                  accountNumber: accountDetails.accountNumber,
                  bank: accountDetails.bank,
                });

                setUseSaved(false);
              }

              // Update the messages array and lastMessage fields

              setWaitPrompt(false);
              setSelected({
                accountName: "",
                accountNumber: "",
                bank: "",
              });
            }}
          >
            Close
          </Button>
        </AlertDialogContent>
      </AlertDialog>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex py-2 fixed bottom-0 w-full place-items-center justify-center gap-1 px-4 z-[9999] bg-neutral-100 dark:bg-neutral-800 border-t dark:border-neutral-600"
      >
        <div className="bg-neutral-50 dark:bg-neutral-800 dark:border dark:border-neutral-600 w-full flex align-middle place-items-center rounded-3xl px-2">
          <Input
            value={currentMessage}
            onChange={(e) => handleInputChange(e)}
            placeholder="Send message..."
            className="rounded-full py-6 shadow-none focus-visible:ring-0 text-[16px] font-semibold border-none dark:text-white text-neutral-800 "
          />

          <input
            type="file"
            className="hidden"
            id="file"
            name="file"
            onChange={async (e: BaseSyntheticEvent) => {
              if (e.target.files[0]?.size > 3000000) {
                alert("Image size must be less than 3MB");
                return;
              }
              setIsUploading(true);
              await uploadFile(e);
              setIsUploading(false);
            }}
          />
          <label
            htmlFor="file"
            className="p-2 rounded-full h-fit cursor-pointer "
          >
            <PhotoIcon width={25} />
          </label>
        </div>
        {uploadProgress > 0 && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-neutral-200 rounded-full shadow-xl shadow-secondary">
            <div
              style={{ width: `${uploadProgress.toString()}%` }}
              className={` bg-secondary h-full rounded-full shadow-xl shadow-secondary`}
            />
          </div>
        )}

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
