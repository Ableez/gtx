"use client";

import {
  CreditCardIcon,
  LockClosedIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";

import ECodeComp from "./eCode";
import type { Conversation } from "../../../chat";
import AccountComp from "./account-dialog";
import CropImage from "../admin/chat/CropImage";
import "react-image-crop/dist/ReactCrop.css";
import CropperJs from "./CropperJs";

type Props = {
  message?: Conversation;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  chatId: string;
};

const AttachFile = ({ message, chatId, scrollToBottom }: Props) => {
  const [openEcode, setOpenEcode] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
        <DrawerTrigger
          type="button"
          className={`focus:outline-none border-secondary rounded-xl duration-300 w-full h-full py-1 grid col-span-1 place-items-center align-middle relative`}
        >
          <PaperClipIcon width={18} />
        </DrawerTrigger>
        <DrawerContent className="z-[99999] max-w-xl mx-auto">
          <div className="max-w-md w-full mx-auto">
            <div className="grid grid-cols-3 pb-8 gap-2 md:gap-4 transition-all duration-400 p-4">
              <DrawerClose
                className={`${
                  message?.transaction.crypto ? "w-full" : "w-fit"
                } cursor-pointer transition-all duration-500 hover:dark:bg-opacity-5 hover:border-orange-300 dark:hover:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-orange-100 text-orange-500 dark:bg-orange-400 dark:bg-opacity-10 rounded-3xl`}
                onClick={() => {
                  setOpenEdit(true);
                }}
              >
                <PhotoIcon width={30} />
                <p className="text-xs">Gallery</p>
              </DrawerClose>
              {!message?.transaction.crypto && (
                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-indigo-300 hover:dark:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:bg-opacity-10 rounded-3xl"
                  onClick={() => setOpenEcode(true)}
                >
                  <LockClosedIcon width={30} />
                  <p className="text-xs">
                    {message?.transaction?.cardDetails?.ecode && "Edit "}
                    E-Code
                  </p>
                </DrawerClose>
              )}

              {!message?.transaction.crypto && (
                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-purple-300 hover:dark:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-purple-100 text-purple-500 dark:bg-purple-400 dark:bg-opacity-10 rounded-3xl"
                  onClick={() => setOpenAccount(true)}
                >
                  <CreditCardIcon width={30} />
                  <p className="text-xs">
                    {message?.transaction?.accountDetails?.accountNumber &&
                      "Edit "}
                    Account
                  </p>
                </DrawerClose>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <ECodeComp
        scrollToBottom={scrollToBottom}
        chatId={chatId}
        openEcode={openEcode}
        setOpenEcode={setOpenEcode}
        edit={message?.transaction?.cardDetails?.ecode ? true : false}
        data={message as Conversation}
      />
      <AccountComp
        scrollToBottom={scrollToBottom}
        chatId={chatId}
        allMessages={message as Conversation}
        openAccount={openAccount}
        setOpenAccount={setOpenAccount}
        edit={
          message?.transaction?.accountDetails?.accountNumber ? true : false
        }
      />
      {/* <CropImage
        scrollToBottom={scrollToBottom}
        chatId={chatId}
        message={message as Conversation}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        owns="user"
      /> */}
      <CropperJs
        owns="user"
        scrollToBottom={scrollToBottom}
        openS={openEdit}
        setOpenS={setOpenEdit}
      />
    </>
  );
};
export default AttachFile;
