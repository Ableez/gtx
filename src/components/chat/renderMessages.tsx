import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { memo, useState } from "react";
import { Message } from "../../../chat";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import AccountComp from "./account-dialog";

type Props = {
  data: Message[];
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  id: string;
};

const RenderMessages = memo(function RenderMessages({
  data,
  scrollRef,
  id,
}: Props) {
  const [openAccount, setOpenAccount] = useState(false);

  const renderUI = data.map((message, idx) => {
    if (message.type === "text") {
      return (
        <div
          key={idx}
          className={`max-w-[250px] md:max-w-[500px] transition-all duration-500 px-2 ${
            message.recipient === "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          <div
            className={`${
              message.recipient === "admin"
                ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-700"
            } flex align-middle place-items-end justify-between px-3 gap-2 py-1.5`}
          >
            <div
              className={`md:font-medium font-normal leading-6 text-sm antialiased`}
            >
              {message.content.text}
              <br />
            </div>
            {message.recipient === "admin" && (
              <div
                className={`${
                  message.recipient === "admin"
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
            message.recipient === "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          {/* {message.card.title === "Account Details" && (
            <div
              className={`${
                message.recipient === "admin"
                  ? "border text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-700"
              } flex align-middle place-items-end justify-between gap-2`}
            >
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-t">
                    <dl className="divide-y divide-neutral-200">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">
                          Account Number
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                          {message.card.data?.accountNumber}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">
                          Account Name
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                          {message.card.data?.accountName}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">
                          Bank Name
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                          {message.card.data?.bankName}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setOpenAccount(true)}>Edit</Button>
                  <AccountComp
                    id={id}
                    data={{
                      accountNumber: message.card.data.accountNumber,
                      accountName: message.card.data.accountName,
                      bankName: message.card.data.bankName,
                    }}
                    idx={idx}
                    edit={true}
                    openAccount={openAccount}
                    setOpenAccount={setOpenAccount}
                  />
                </CardFooter>
              </Card>
            </div>
          )} */}
          {message.card.title === "Account Details" && (
            <div
              className={`${
                message.recipient === "admin"
                  ? "border text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                  : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-700"
              } flex align-middle place-items-end justify-between gap-2`}
            >
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">E-code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-t">
                    <dl className="divide-y divide-neutral-200">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">
                          Account Number
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                          {message.card.data?.accountNumber}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setOpenAccount(true)}>Edit</Button>
                  <AccountComp
                    id={id}
                    data={{
                      accountNumber: message.card.data.accountNumber,
                      accountName: message.card.data.accountName,
                      bankName: message.card.data.bankName,
                    }}
                    idx={idx}
                    edit={true}
                    openAccount={openAccount}
                    setOpenAccount={setOpenAccount}
                  />
                </CardFooter>
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
            message.recipient === "admin"
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          <div
            className={`${
              message.recipient === "admin"
                ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200 dark:bg-neutral-700"
            } grid align-middle place-items-center justify-between px-2 gap-2 py-1.5`}
          >
            <div className="rounded-2xl overflow-clip">
              {message.content.media.url ? (
                <Image
                  src={message.content.media.url}
                  alt={message.content.media.metadata?.media_name as string}
                  width={220}
                  height={220}
                  className="w-full bg-neutral-200 dark:bg-neutral-700"
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
          ref={scrollRef}
        ></div>
      </div>
    </>
  );
});

export default RenderMessages;
