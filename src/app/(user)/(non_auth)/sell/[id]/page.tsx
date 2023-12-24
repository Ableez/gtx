"use client";

import Loader from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/lib/context/AuthProvider";
import { giftcards } from "@/lib/data/giftcards";
import { auth, db } from "@/lib/utils/firebase";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  BaseSyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  params: {
    id: string;
  };
};

type GiftCard = {
  id: string;
  popular: boolean;
  name: string;
  image: string;
  title: string;
  description: string;
  listings: { dollar: number }[];
  coverImage: string;
  subCategory: { value: string; title: string }[];
};

type Params = {
  price: number;
  subcategory: string;
};

const GiftCardPage = ({ params }: Props) => {
  const [data, setData] = useState<GiftCard>();
  const [form, setForm] = useState<Params>({
    price: 0,
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingUserState, setLoadingUserState] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLogged(true);
      } else {
        setLogged(false);
      }
      setLoadingUserState(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const router = useRouter();

  useEffect(() => {
    const d = giftcards.find((card) => {
      return card.id === params.id;
    });

    if (d) {
      setData(d);
    }
  }, [params.id]);

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const val = e.target.value;

    setForm((prev) => {
      return {
        ...prev,
        price: Number(val),
      };
    });
  };

  if (loadingUserState) {
    return (
      <div className="flex justify-center place-items-center p-16">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center place-items-center p-16">
        <Loader />
      </div>
    );
  }

  const selectsLive = async (chan: string) => {
    setLoading(true);

    // User selects live chat
    if (chan === "live") {
      try {
        const messagesRef = collection(db, "Messages");

        const subcategory = data.subCategory.find(
          (c) => c.value === form.subcategory
        );

        const cardInfo = {
          cardTitle: data.title,
          price: `$${form.price}`,
          subcategory: `${subcategory?.title}`,
        };

        const createdChat = await addDoc(messagesRef, {
          user: {
            username: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
            uid: auth.currentUser?.uid,
          },
          transactions: [],
          lastMessage: {
            sender: auth.currentUser?.displayName,
            media: false,
            text: `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory} giftcard`,
            timeStamp: new Date(),
            read: false,
          },
          messages: [
            {
              sender: auth.currentUser?.displayName,
              media: "",
              text: `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory} giftcard`,
              sent_at: new Date(),
            },
          ],
          transactionStarted: false,
          created_at: new Date(),
          updated_at: new Date(),
        });

        window.location.href = `/chat/${createdChat.id}`;
      } catch (error) {
        console.error(error, "error creating chat");
        setLoading(false);
      }
    }
  };

  const selectsWhatsApp = async (chan: string) => {
    setLoading(true);

    try {
      // User selects whatsapp
      if (chan === "whatsapp") {
        const subcategory = data.subCategory.find(
          (c) => c.value === form.subcategory
        );

        const cardInfo = {
          cardTitle: data.title,
          price: `$${form.price}`,
          subcategory: `${subcategory?.title}`,
        };

        const whatsappMessage = `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory} giftcard`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=2348103418286&text=${encodeURIComponent(
          whatsappMessage
        )}`;

        // Navigating to WhatsApp
        window.location.href = whatsappLink;
      }
    } catch (error) {
      console.log("error with whatsapp", error);
    }
  };

  if (!logged) {
    return (
      <AlertDialog open={!logged}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Not Logged in!</AlertDialogTitle>
            <AlertDialogDescription>
              You can only sell a gift card when you are logged in
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogAction
              className="border border-neutral-400/30 p-3  text-neutral-800 font-light rounded-xl dark:text-neutral-400"
              onClick={() => {
                router.push("/sell");
              }}
            >
              Close
            </AlertDialogAction>

            <AlertDialogAction
              className="bg-primary p-3 text-white font-semibold rounded-xl"
              onClick={() => {
                setLoading(true);
                router.push("/login");
              }}
            >
              Okay Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <>
      <div className="container font-bold text-lg relative max-w-screen-sm">
        <Link
          href={"/sell"}
          className="border-2 absolute -top-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 p-3"
        >
          <ArrowLeftIcon width={20} />
        </Link>
        <div className="grid place-items-center justify-center gap-6">
          <h4 className="text-center">{data.name}</h4>
          <Image
            src={"/logoplace.svg"}
            alt="Vendor Logo"
            width={120}
            height={120}
            className="dark:opacity-20"
          />
        </div>
        <div className="my-6">
          <h4 className="text-sm text-neutral-400 py-1.5 font-light">
            Subcategory
          </h4>
          <Select
            disabled={!logged}
            onValueChange={(e) => {
              setForm((prev) => {
                return {
                  ...prev,
                  subcategory: e,
                };
              });
            }}
          >
            <SelectTrigger className="w-full ring-neutral-300 hover:ring-neutral-500 relative disabled:bg-opacity-50">
              <SelectValue placeholder="Choose a subcategory..." />
            </SelectTrigger>
            <SelectContent className="z-[9992] dark:bg-neutral-700 bg-neutral-200 max-h-52 mt-2 border border-neutral-300 shadow-md dark:shadow-pink-950">
              <SelectGroup>
                <SelectLabel>Subcategories</SelectLabel>
                {data.subCategory.map((sub, idx) => {
                  return (
                    <SelectItem className="py-3" key={idx} value={sub.value}>
                      {sub.title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-sm text-neutral-400 py-1.5 font-light">Price</h4>
          <div
            className={`flex align-middle place-items-center justify-between ring-neutral-300 hover:ring-neutral-600 gap-2 ring-1 rounded-xl px-3 ${
              !logged && "dark:ring-neutral-700 focus-visible:ring-neutral-400"
            }`}
          >
            <h4 className="font-bold text-2xl text-neutral-400 dark:text-neutral-600">
              $
            </h4>
            <Input
              disabled={!logged}
              min={20}
              onChange={(e) => handleInputChange(e)}
              max={2000}
              type="number"
              placeholder="Enter an amount..."
              className="border-transparent focus-visible:ring-0 p-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 ring-transparent h-14 text-base dark:text-white disabled:bg-opacity-50"
            />
          </div>
        </div>
        {logged ? (
          <h4
            className={`${
              form.price < 3 && "text-red-500"
            } font-light text-xs text-center p-4`}
          >
            Price should be above $3
          </h4>
        ) : (
          <h4 className={`text-red-500 font-light text-xs text-center p-4`}>
            You must be logged in
          </h4>
        )}

        <div className="mt-10">
          <AlertDialog>
            {logged ? (
              <AlertDialogTrigger asChild>
                <Button
                  disabled={
                    loading || form.price < 3 || form.subcategory === ""
                  }
                  className="w-full h-12 shadow-lg shadow-pink-300 dark:shadow-pink-950 disabled:bg-opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader /> Please wait...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </AlertDialogTrigger>
            ) : (
              <Link href={"/login"}>
                <Button
                  onClick={() => setLoading(true)}
                  disabled={loading}
                  className={`w-full h-12 shadow-lg shadow-pink-300 dark:shadow-pink-950 disabled:bg-opacity-50 ${
                    loading && "bg-opacity-50"
                  }`}
                >
                  {loading && <Loader />}
                  Login to continue
                </Button>
              </Link>
            )}

            <AlertDialogContent>
              <AlertDialogCancel className="absolute top-2 right-4 bg-neutral-200 dark:bg-neutral-800 rounded-full p-2">
                <XMarkIcon width={20} />
              </AlertDialogCancel>
              <AlertDialogHeader className="py-4">
                <AlertDialogTitle>How would you like to sell</AlertDialogTitle>
                <AlertDialogDescription>
                  Select Live Chat for quick payout
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-flow-col gap-6">
                <AlertDialogAction
                  disabled={loading}
                  onClick={() => selectsWhatsApp("whatsapp")}
                  className="bg-slate-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 border-neutral-300 border text-neutral-800 shadow-none py-4 rounded-xl disabled:bg-opacity-50"
                >
                  WhatsApp
                </AlertDialogAction>
                <AlertDialogAction
                  disabled={loading}
                  onClick={() => selectsLive("live")}
                  className="bg-primary shadow-none py-4 rounded-xl disabled:bg-opacity-50 text-white font-semibold"
                >
                  Live Chat
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-10 text-center font-light text-[0.6em]">
          Please read our{" "}
          <Link href={"/"} className=" text-secondary">
            terms and conditions
          </Link>
        </div>
      </div>
    </>
  );
};

export default GiftCardPage;
