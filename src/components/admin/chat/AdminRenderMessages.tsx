import { CheckIcon, ClockIcon, EyeIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import { Conversation, Message } from "../../../../chat";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import SetRateComp from "./setRateDialog";

type Props = {
  data: Conversation;
  scrollToBottom: React.MutableRefObject<HTMLDivElement | null>;
  id: string;
  card:
    | {
        id: string;
        name: string;
        vendor: string;
        subcategory: string;
        price: number;
        ecode?: number | undefined;
      }
    | undefined;
};

const AdminRenderMessages = memo(function AdminRenderMessages({
  card,
  data,
  scrollToBottom,
  id,
}: Props) {
  const [openAccount, setOpenAccount] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [hideCode, setHideCode] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1800);
  }, [copied]);

  const renderUI = data.messages.map((message, idx) => {
    if (message.type === "text") {
      return (
        <div
          key={idx}
          className={`max-w-[250px] md:max-w-[500px] transition-all duration-500 px-2 ${
            message.recipient !== "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          <div
            className={`${
              message.recipient !== "admin"
                ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
            } flex align-middle place-items-end justify-between px-3 gap-2 py-1.5`}
          >
            <div
              className={`md:font-medium font-normal leading-6 text-sm antialiased`}
            >
              {message.content.text}
              <br />
            </div>
            {message.recipient !== "admin" && (
              <div
                className={`${
                  message.recipient !== "admin"
                    ? "text-neutral-200"
                    : "text-neutral-400"
                } w-fit float-right flex align-middle place-items-center justify-end justify-self-end gap-1 mt-1`}
              >
                <p className="text-[10px] font-light leading-3">9:12PM</p>
                {message.read_receipt.delivery_status === "not_sent" ? (
                  <ClockIcon width={12} />
                ) : message.read_receipt.delivery_status === "sent" ? (
                  <CheckIcon width={12} />
                ) : message.read_receipt.delivery_status === "delivered" ? (
                  <div className="flex align-middle place-items-center">
                    <CheckIcon
                      className="font-bold"
                      width={12}
                      strokeWidth={3}
                    />
                    <CheckIcon
                      className="font-bold -mx-1.5"
                      width={12}
                      strokeWidth={3}
                    />
                  </div>
                ) : message.read_receipt.delivery_status === "seen" ? (
                  <div className="flex align-middle place-items-center">
                    <CheckIcon
                      className="dark:text-blue-500 text-blue-600 font-bold"
                      width={12}
                      strokeWidth={3}
                    />
                    <CheckIcon
                      className="dark:text-blue-500 text-blue-600 font-bold -mx-1.5"
                      width={12}
                      strokeWidth={3}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (message.type === "card") {
      return (
        <div
          key={idx}
          className={`max-w-[350px] md:max-w-[500px] transition-all duration-500 px-2 ${
            message.recipient !== "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          {message.card.title === "Account Details" && (
            <div
              className={`${
                message.recipient !== "admin"
                  ? "text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
              } flex align-middle place-items-end justify-between gap-2 border`}
            >
              <Card className="border-none shadow-none rounded-tl-[3px]">
                <CardHeader>
                  <CardTitle className="text-lg">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="max-w-[250px] min-w-[200px]">
                  <div className="border-t">
                    <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-500 dark:text-neutral-400">
                          Account Number
                        </dt>
                        <dd className="mt-1 text-sm tracking-wide leading-6 text-neutral-700 dark:text-white sm:col-span-2 sm:mt-0 font-bold">
                          {message.card.data?.accountNumber}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-500 dark:text-neutral-400">
                          Account Name
                        </dt>
                        <dd className="mt-1 text-sm tracking-wide leading-6 text-neutral-700 dark:text-white sm:col-span-2 sm:mt-0 font-bold">
                          {message.card.data?.accountName}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-500 dark:text-neutral-400">
                          Account Bank
                        </dt>
                        <dd className="mt-1 text-sm tracking-wide leading-6 text-neutral-700 dark:text-white sm:col-span-2 sm:mt-0 font-bold">
                          {message.card.data?.bankName}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <Button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(message.card.data?.accountNumber)
                      .then(() => {
                        setCopied(true);
                      });
                  }}
                  title="Copy Account Number"
                  variant={"ghost"}
                  className="float-right text-xs"
                >
                  {copied ? (
                    <div className="flex gap-1 align-middle place-items-center items-center">
                      Copied <CheckIcon width={18} />
                    </div>
                  ) : (
                    <CopyIcon width={18} />
                  )}
                </Button>
              </Card>
            </div>
          )}

          {message.card.title === "card_detail" && (
            <div
              className={`${
                message.recipient !== "admin"
                  ? "text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
              } flex align-middle place-items-end justify-between gap-2 border`}
            >
              <Card className="border shadow-md dark:bg-black rounded-tl-[3px]">
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    Card Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
                    <Image
                      alt="Card logo"
                      width={100}
                      height={100}
                      src={"/logoplace.svg"}
                      className="w-8 p-1 bg-primary rounded-3xl"
                    />
                    <h4 className="md:text-base text-base font-bold">
                      {message.card.data.vendor} Card
                    </h4>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700">
                    <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                          Subcategory
                        </dt>
                        <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-white sm:col-span-2 sm:mt-0">
                          {message.card.data.subcategory || "Please wait..."}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                          Price
                        </dt>
                        <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-white sm:col-span-2 sm:mt-0">
                          {message.card.data.price || "Please wait..."}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {message.card.title === "e-Code" && (
            <div
              className={`${
                message.recipient !== "admin"
                  ? "text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
              } flex align-middle place-items-end justify-between gap-2 border`}
            >
              <Card className="border-none shadow-none rounded-tl-[3px]">
                <CardHeader>
                  <CardTitle className="text-base">E-code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex align-middle justify-center place-items-center">
                    <div className="select-none py-1 px-2.5 hover:bg-neutral-100 duration-300 rounded-lg tracking-widest bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-white">
                      {!hideCode
                        ? message.card.data?.value.split("")
                        : "●●●● ●●●● ●●●● ●●●●"}
                    </div>
                    <button
                      onClick={() => setHideCode((prev) => !prev)}
                      className="p-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900"
                    >
                      {hideCode ? (
                        <EyeIcon width={18} />
                      ) : (
                        <EyeClosedIcon width={18} />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {message.card.title === "rate" && (
            <div
              className={`${
                message.recipient !== "admin"
                  ? "border text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
              } flex align-middle place-items-end justify-between gap-2`}
            >
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-base">Card Rate</CardTitle>
                </CardHeader>
                <CardContent className="max-w-[250px] min-w-[200px] grid gap-1">
                  <div className="select-none text-base font-semibold">
                    ₦{message.card.data?.value}
                  </div>
                  <div className="select-none text-neutral-600">
                    for {card?.price}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setOpenRate(true)}>Edit</Button>
                  <SetRateComp
                    card={card}
                    scrollToBottom={scrollToBottom}
                    id={id}
                    idx={idx}
                    edit={true}
                    openRate={openRate}
                    setOpenRate={setOpenRate}
                  />
                </CardFooter>
              </Card>
            </div>
          )}

          {message.card.title === "start_transaction" && (
            <div
              className={`${
                message.recipient === "admin"
                  ? "text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
              } flex align-middle place-items-end justify-between gap-2 border`}
            >
              <Card
                className={`${
                  message.card.data.status === "rejected_by_user"
                    ? "text-rose-600 dark:border-red-600 border-2"
                    : (message.card.data.status = "accepted_by_user"
                        ? "text-emerald-600"
                        : "")
                } border-none shadow-none rounded-tl-[3px]`}
              >
                <CardHeader>
                  <CardTitle
                    className={`${
                      message.card.data.status === "rejected_by_user"
                        ? "text-rose-600"
                        : (message.card.data.status = "accepted_by_user"
                            ? "text-emerald-600"
                            : "")
                    } text-base`}
                  >
                    {message.card.data.status === "rejected_by_user"
                      ? "Rejected by user"
                      : (message.card.data.status = "accepted_by_user"
                          ? "User Accepted"
                          : "Transaction")}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`max-w-[250px] min-w-[200px] grid gap-1 dark:text-neutral-500 text-neutral-400`}
                >
                  {message.card.data.status === "rejected_by_user"
                    ? "Transaction has been rejected by user"
                    : (message.card.data.status = "accepted_by_user"
                        ? "User Accepted"
                        : "Waiting for user to confirm")}
                  <div className="mt-2">
                    {message.card.data.status === "rejected_by_user" ? (
                      <Button>Resend</Button>
                    ) : (
                      (message.card.data.status = "accepted_by_user" ? (
                        <Button>Finish transaction</Button>
                      ) : null)
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      );
    }

    if (message.type === "media" && message.content.media.url) {
      return (
        <div
          key={idx}
          className={`max-w-[250px] md:max-w-[500px] transition-all duration-500 px-2 ${
            message.recipient !== "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          <div
            className={`${
              message.recipient !== "admin"
                ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-800"
            } grid align-middle place-items-center justify-between px-2 gap-2 py-1.5`}
          >
            <div className="rounded-2xl overflow-clip">
              {message.content.media.url ? (
                <Image
                  src={message.content.media.url || "/logoplace.svg"}
                  alt={message.content.media.metadata?.media_name as string}
                  width={220}
                  height={220}
                  className="w-full bg-neutral-200 dark:bg-neutral-800"
                />
              ) : (
                <div className="flex align-middle place-items-center justify-center w-full h-full">
                  <PhotoIcon
                    width={120}
                    className="opacity-70 text-neutral-50"
                  />
                </div>
              )}
            </div>
            <div
              className={`md:font-medium font-normal leading-6 text-sm antialiased text-right w-full`}
            >
              {message.content.media.caption}
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <>
      <div className="grid gap-2 py-3">
        {renderUI}
        <div
          className="mb-12 transition-all duration-500"
          ref={scrollToBottom}
        ></div>
      </div>
    </>
  );
});

export default AdminRenderMessages;
