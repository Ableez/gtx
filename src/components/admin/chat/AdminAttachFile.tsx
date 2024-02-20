"use client";

import {
  CreditCardIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { formatFileSize } from "@/lib/utils/formartFileSize";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { CardDetails, Conversation } from "../../../../chat";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import SetRateComp from "./setRateDialog";
import StartAdminTransaction from "./StartTransaction";
import { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropImage from "./CropImage";

type Props = {
  message?: Conversation;
  formRef: React.RefObject<HTMLFormElement>;
  id: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const AdminAttachFile = ({ message, formRef, id, scrollToBottom }: Props) => {
  const [error, setError] = useState("");
  const [caption, setCaption] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [openRate, setOpenRate] = useState(false);
  const [openStartTransaction, setOpenStartTransaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [openEdit, setOpenEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (error) setError("");
    }, 5500);
  }, [error]);

  // image crop feature,

  const onCropChange = (crop: Crop) => {
    setCrop(crop);
  };

  const onCropComplete = (croppedArea: Crop, croppedAreaPixels: Crop) => {
    // Here you can do something with the cropped image area
  };

  return (
    <>
      <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
        <DrawerTrigger
          type="button"
          className={`focus:outline-none border-secondary rounded-xl duration-300 w-full h-full py-1 grid col-span-1 place-items-center align-middle relative`}
        >
          <PaperClipIcon width={22} />
        </DrawerTrigger>
        <DrawerContent className="z-[99999] max-w-xl mx-auto">
          <div className="max-w-md w-full mx-auto">
            {pdfFile ? (
              <div className="p-4">
                <button
                  title="Cancel"
                  onClick={() => {
                    setPdfFile(null);
                    setCaption("");
                  }}
                  className="dark:bg-neutral-800 rounded-full p-2 absolute top-4 left-3 transition-all duration-75 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <XMarkIcon width={22} className="" />
                </button>
                <div>
                  {pdfFile && (
                    <div className="grid p-6 align-middle place-items-center gap-1.5">
                      <DocumentTextIcon
                        width={80}
                        className="text-neutral-600"
                      />
                      <p className="text-neutral-400 text-center w-80 truncate">
                        {pdfFile.name}
                      </p>
                      <p className="text-neutral-600">
                        {formatFileSize(pdfFile.size)}
                      </p>
                    </div>
                  )}
                  <div className="mb-3 w-[50%] mx-auto flex align-middle place-items-center gap-2">
                    {progress > 0 && <Progress value={progress} />}
                  </div>
                  <div
                    className={`text-red-500 text-xs text-center mb-1 transition-all duration-100 font-bold dark:bg-neutral-900 rounded-xl overflow-clip text-clip absolute  px-2 top-10 left-1/2 -translate-x-1/2 delay-100 opacity-0 ${
                      error ? "h-fit w-fit p-0.5 opacity-80" : "h-0 w-0 p-0"
                    }`}
                  >
                    {error}
                  </div>
                  <form className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-neutral-800 rounded-lg max-w-md mx-auto">
                    <input
                      id="message"
                      name="message"
                      disabled={loading}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      autoCorrect="true"
                      autoComplete="off"
                      className={`font-normal transition-all duration-300 resiL-none leading-4 text-xs md:text-sm antialiased focus:outline-none col-span-10 w-full h-fit p-3 bg-neutral-200 dark:bg-neutral-800 outline-none rounded-l-lg disabled:cursor-not-allowed disabled:bg-opacity-50`}
                      placeholder="Caption (optional)"
                      data-gramm="false"
                      data-gramm_editor="false"
                      data-enable-grammarly="false"
                    />
                    <button
                      title="Send Message"
                      disabled={loading}
                      type="submit"
                      className="focus:outline-none col-span-2 border-secondary duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary text-white rounded-r-lg p-2 px-4 disabled:cursor-not-allowed disabled:bg-opacity-50"
                    >
                      <PaperAirplaneIcon width={25} />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 pb-8 gap-2 md:gap-4 transition-all duration-400 p-4">
                <DrawerClose
                  className="cursor-pointer transition-all duration-500 hover:dark:bg-opacity-5 hover:border-orange-300 hover:dark:border-neutral-700 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-orange-100 text-orange-500 dark:bg-orange-400 dark:bg-opacity-10 rounded-3xl "
                  onClick={() => {
                    setOpenEdit(true);
                  }}
                >
                  <PhotoIcon width={30} />
                  <p className="text-xs">Gallery</p>
                </DrawerClose>

                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-indigo-300 hover:dark:border-neutral-700 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:bg-opacity-10 rounded-3xl relative"
                  onClick={() => setOpenRate(true)}
                >
                  <CurrencyDollarIcon width={30} />
                  <p className="text-xs">
                    {message?.transaction.cardDetails.rate ? "Edit " : "Set "}
                    Rate
                  </p>
                  {!message?.transaction.cardDetails.rate && (
                    <span className="text-[10px] py-0.5 px-1.5 bg-rose-400 rounded-full text-white absolute -top-1 right-0">
                      Not Set
                    </span>
                  )}
                </DrawerClose>

                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-purple-300 hover:dark:border-neutral-700 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-purple-100 text-purple-500 dark:bg-purple-400 dark:bg-opacity-10 rounded-3xl"
                  onClick={() => setOpenStartTransaction(true)}
                >
                  <CreditCardIcon width={30} />
                  <p className="text-xs">Transaction</p>
                </DrawerClose>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <SetRateComp
        edit={message?.transaction.cardDetails.rate ? true : false}
        scrollToBottom={scrollToBottom}
        id={id}
        openRate={openRate}
        setOpenRate={setOpenRate}
        card={message?.transaction.cardDetails as CardDetails}
      />
      <StartAdminTransaction
        openStartTransaction={openStartTransaction}
        setOpenStartTransaction={setOpenStartTransaction}
        card={message}
        scrollToBottom={scrollToBottom}
        id={id}
      />
      <CropImage
        id={id}
        message={message as Conversation}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        scrollToBottom={scrollToBottom}
      />
    </>
  );
};
export default AdminAttachFile;
