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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/app/loading";
import { SunIcon } from "@heroicons/react/24/outline";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  }, [error, setLoading]);

  if (!data) {
    return <div className="p-16 text-center text-neutral-400">No data</div>;
  }

  const startChatAction = startChat.bind(null, data);

  const selectsWhatsapp = async () => {
    const subcategoryData = data.subcategory.find(
      (c) => c.value === subcategoryValue
    );

    const cardInfo = {
      cardTitle: data.title,
      price: `$${price}`,
      subcategory: `${subcategoryData?.value}`,
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
        toast("Error!", {
          description: "You need to login to continue",
          dismissible: true,
          duration: 4500,
          action: {
            label: "Login",
            onClick: () => router.push("/login"),
          },
        });
        setLoading(false);
      }
      setError(res?.error as string);
      if (res?.proceed) {
        router.refresh();
        router.push(`/chat/${res.link}`);
      }
    } catch (error) {
      toast("Error!", {
        description: "An error occured!. Try again",
        dismissible: true,
        duration: 3500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="duration-300 max-w-screen-sm mx-auto">
      <div className="grid place-items-center justify-center gap-6">
        <h5 className="text-center text-base w-[60vw]">{data.name} Giftcard</h5>
        <Image
          src={data.image}
          width={65}
          height={65}
          alt="Vender Logo"
          priority={true}
          className="text-xs"
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
                {data.subcategory.map((sub, idx) => {
                  return (
                    <SelectItem key={idx} value={sub.value}>
                      <div className="flex align-middle place-items-center justify-start gap-3">
                        <Image
                          src={sub.image}
                          width={20}
                          height={20}
                          alt="Flag"
                        />
                        <span>{sub.value}</span>
                      </div>
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
              autoComplete="off"
              minLength={3}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="block w-full rounded-md border-0 pl-8 text-neutral-900 ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 py-7 font-medium text-lg dark:text-white dark:ring-neutral-700"
              placeholder="0.00"
            />
          </div>
        </div>

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
            {loading ? (
              <>
                <SunIcon width={18} className="animate-spin mr-1" /> Please
                wait...
              </>
            ) : (
              "Live chat"
            )}
          </Button>
        </div>
      </form>
      <p className="text-center text-neutral-500 dark:text-neutral-300 font-normal my-2">
        or
      </p>
      <div className="w-full grid place-items-center">
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
          className="mx-auto text-xs duration-300 border w-fit"
        >
          Continue to WhatsApp
        </Button>
      </div>

      <p
        className={`text-[10px] text-center italic w-fit px-3 mx-auto rounded-xl bg-purple-200 dark:bg-purple-800 dark:bg-opacity-20 dark:text-white text-purple-900 font-medium mt-6`}
      >
        Please sign in to use our in-app{" "}
        <span className="font-extrabold">chat feature</span>.
      </p>
    </div>
  );
};

export default CardSelector;
