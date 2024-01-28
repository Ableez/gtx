"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { startChat } from "@/lib/utils/actions";
import { giftcards } from "@/lib/data/giftcards";
import { useFormStatus } from "react-dom";
import Cookies from "js-cookie";
import Link from "next/link";
import { RedirectType, redirect, useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import Loader from "../Loader";
import { isNull } from "util";

type Props = {
  id: string;
};

const CardSelector = ({ id }: Props) => {
  const user = Cookies.get("user");
  const [subcategoryValue, setSubcategoryValue] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [error, setError] = useState<string>("");
  const { pending } = useFormStatus();
  const [isLogged, setLogged] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const data = giftcards.find((card) => {
    return card.id === id;
  });

  useEffect(() => {
    if (user) {
      setLogged(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  if (!data) {
    return <div className="p-16 text-center text-neutral-400">No data</div>;
  }

  const startChatAction = startChat.bind(null, data);

  const selectsWhatsapp = async () => {
    const subcategoryData = data.subCategory.find(
      (c) => c.value === subcategoryValue
    );

    const cardInfo = {
      cardTitle: data.title,
      price: `$${price}`,
      subcategory: `${subcategoryData?.title}`,
    };

    const whatsappMessage = `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory} giftcard`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=2348103418286&text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.location.href = whatsappLink;
  };

  const submitChatAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await startChatAction(
        new FormData(e.target as HTMLFormElement)
      );

      if (!res?.logged) {
        setOpen(true);
        setLoading(false);
      }
      setError(res?.error as string);
      if (res?.proceed) {
        router.refresh()
        router.push(`/chat/${res.link}`);
      }
    } catch (error) {
      console.log("START_CHAT_ACTION => ", error);
    }
  };

  return (
    <div className="duration-300">
      {loading && (
        <div className="h-screen w-screen bg-white dark:bg-[#0000005f] bg-opacity-10 backdrop-blur-sm fixed top-0 left-0 z-[99999] grid place-items-center align-middle">
          <Loader />
        </div>
      )}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerContent className="border-none ring-0 max-w-xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="pb-2">Not Logged in!</DrawerTitle>
            <DrawerDescription>
              <p className="font-semibold">
                You can only sell a gift card when you are logged in.
              </p>
              <p className="text-[12px] text-center italic w-fit px-3 mx-auto rounded-xl bg-purple-200 text-purple-900 font-medium mt-6">
                Use{" "}
                <Button
                  variant={"link"}
                  className="px-0 text-green-500 font-semibold italic"
                  onClick={() => selectsWhatsapp()}
                >
                  WhatsApp
                </Button>{" "}
                instead to transact without an account.
              </p>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-2">
            <Link
              href={"/login"}
              className="bg-primary p-3 text-white font-semibold rounded-xl w-fit mx-auto px-6"
            >
              Okay Login
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="grid place-items-center justify-center gap-6">
        <h4 className="text-center">{data.name} Giftcard</h4>
        <Image
          src={"/logoplace.svg"}
          alt="Vendor Logo"
          width={120}
          height={120}
          className="dark:opacity-20"
        />
      </div>

      <form onSubmit={submitChatAction} className="my-4 space-y-5 duration-300">
        <div>
          <Label className="text-neutral-400" htmlFor="subcategory">
            Subcategory
          </Label>
          <Select
            onValueChange={(e) => {
              setSubcategoryValue(e);
            }}
            name="subcategory"
            required
          >
            <SelectTrigger
              id="subcategory"
              disabled={pending || loading}
              aria-disabled={pending || loading}
              className="w-full mt-2 ring-neutral-200 focus:ring-1 focus:ring-inset focus:ring-pink-600 pl-4"
            >
              <SelectValue
                aria-disabled={pending || loading}
                placeholder="Select a subcategory"
                className="placeholder:text-neutral-400"
              />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectGroup>
                <SelectLabel>Subcategory</SelectLabel>
                {data.subCategory.map((sub, idx) => {
                  return (
                    <SelectItem key={idx} value={sub.value}>
                      {sub.title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-neutral-400" htmlFor="price">
            Price
          </Label>
          <div className="relative mt-2 rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-neutral-400 sm:text-sm">$</span>
            </div>
            <Input
              type="number"
              name="price"
              required
              disabled={pending || loading}
              aria-disabled={pending || loading}
              id="price"
              minLength={3}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="block w-full rounded-md border-0 pl-8 text-neutral-900 ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 py-7 font-medium text-lg dark:text-white dark:ring-neutral-700"
              placeholder="0.00"
            />
          </div>
        </div>
        {/* {isLogged && (
          <>
            <div>
              <div className="grid grid-cols-2 align-middle place-items-center gap-4 w-full">
                <div className="space-y-6 w-full">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="whatsapp"
                      type="radio"
                      name="channel" // Use the same name for both radio buttons
                      value="whatsapp"
                      className="peer hidden"
                    />
                    <Label
                      htmlFor="whatsapp"
                      className="block text-sm font-medium leading-6 text-neutral-900 cursor-pointer p-6 ring-1 rounded-lg ring-neutral-300 w-full text-center hover:bg-green-100 duration-200 md:shadow-inner hover:ring-green-300 peer-checked:ring-green-400 peer-checked:bg-green-200"
                    >
                      WhatsApp
                    </Label>
                  </div>
                </div>
                <div className={`space-y-6 w-full`}>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="livechat"
                      type="radio"
                      name="channel"
                      value="livechat"
                      className="peer hidden"
                      disabled={isLogged ? false : true}
                    />
                    <Label
                      htmlFor="livechat"
                      className="block text-sm font-medium leading-6 text-neutral-900 cursor-pointer p-6 ring-1 rounded-lg ring-neutral-300 w-full text-center hover:bg-pink-100 duration-200 md:shadow-inner hover:ring-pink-300 peer-checked:ring-pink-400 peer-checked:bg-pink-200 active:bg-pink-300"
                    >
                      Live chat
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )} */}

        <div className="w-full grid place-items-center">
          <Button
            disabled={
              pending
                ? true
                : (price as number) < 3
                ? true
                : !subcategoryValue
                ? true
                : loading
            }
            aria-disabled={
              pending
                ? true
                : (price as number) < 3
                ? true
                : !subcategoryValue
                ? true
                : loading
            }
            onClick={() => {
              if (!isLogged) {
                setError("You must be logged in.");
              }
            }}
            type="submit"
            className={`${
              pending && "bg-neutral-200 text-neutral-400"
            } md:w-[70%] w-full py-6 shadow-lg `}
          >
            {loading ? "Please wait..." : "Live chat"}
          </Button>
        </div>
      </form>
      <Button
        variant={"ghost"}
        disabled={
          pending || !price || !subcategoryValue || price < 3 || loading
        }
        aria-disabled={
          pending || !price || !subcategoryValue || price < 3 || loading
        }
        onClick={() => {
          if (!price || !subcategoryValue) {
            setError("All fields are required");
          } else {
            selectsWhatsapp();
          }
        }}
        className="mx-auto text-xs underline w-full text-neutral-500 duration-300"
      >
        Or Continue to WhatsApp
      </Button>
      <p
        className={`text-[10px] overflow-clip leading-5 border-neutral-800 mt-2 animate-out font-medium text-red-500 text-center duration-150 ${
          error ? "opacity-100 h-5 leading-5" : "opacity-100 h-0 leading-10"
        }`}
      >
        {error && error}
      </p>
      <p
        className={`text-[10px] text-center italic w-fit px-3 mx-auto rounded-xl bg-purple-200 text-purple-900 font-medium mt-6`}
      >
        For faster checkout, Please sign in to use our in-app{" "}
        <span className="font-extrabold">chat feature</span>.
      </p>
    </div>
  );
};

export default CardSelector;
