"use client";

import {
  CreditCardIcon,
  DocumentTextIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { formatFileSize } from "@/lib/utils/formartFileSize";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/utils/firebase";
import { Progress } from "../ui/progress";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import SuccessCheckmark from "../successMark";
import ECodeComp from "./eCode";
import { Conversation } from "../../../chat";
import AccountComp from "./account-dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SunIcon } from "@heroicons/react/24/outline";

type Props = {
  message?: Conversation;
  formRef: React.RefObject<HTMLFormElement>;
  id: string;
};

const AttachFile = ({ message, formRef, id }: Props) => {
  const [error, setError] = useState("");
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/logoplace.svg");
  const { pending } = useFormStatus();
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const [openEcode, setOpenEcode] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (error) setError("");
    }, 5500);
  }, [error]);

  const sendImageAction = async (e: React.FormEvent) => {

    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("id", id);
    setLoading(true);
    if (image && image.size > 5000000) {
      setError("Image size must be less than 5MB");
      setLoading(false);
      return;
    }

    if (image) {
    setProgress(1);
      
      const storageRef = ref(
        storage,
        `/cardImages/www.greatexchange.co---${id}---${image.name}`
      );

      setProgress(1);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snap) => {
          const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(progress);
        },
        (err) => {
          setError(err.message);
        },
        async () => {
          const mediaurl = await getDownloadURL(uploadTask.snapshot.ref);

          const sentMessage = await sendUserMessage(
            { timeStamp: new Date() },
            id,
            formData,
            {
              caption: caption,
              url: mediaurl,
              metadata: {
                media_name: uploadTask.snapshot.metadata.name,
                media_size: uploadTask.snapshot.metadata.size,
                media_type: uploadTask.snapshot.metadata.contentType,
              },
            },
            true
          );

          if (sentMessage?.error) {
            setError(sentMessage?.error);
            setLoading(false);
            return;
          }

          if (sentMessage?.success) {
            setProgress(0);
            setImage(null);
            setCaption("");
            setError("");
            setSent(true);
            setLoading(false);
            console.log("Message & Image sent!");
          }
        }
      );
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger
          type="button"
          className={`focus:outline-none border-secondary rounded-xl duration-300 w-full h-full py-1 grid col-span-1 place-items-center align-middle relative`}
        >
          {pdfFile || image ? (
            <div className="bg-red-400 rounded-full p-1.5 absolute top-0 left-0" />
          ) : null}
          <PaperClipIcon width={22} />
        </DrawerTrigger>
        <DrawerContent className="z-[99999] max-w-xl mx-auto">
          <div className="max-w-md w-full mx-auto">
            {image || pdfFile ? (
              <div className="p-4">
                <button
                  onClick={() => {
                    setImage(null);
                    setPdfFile(null);
                    setCaption("");
                  }}
                  className="dark:bg-neutral-800 rounded-full p-2 absolute top-4 left-3 transition-all duration-75 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <XMarkIcon width={22} className="" />
                </button>
                <div>
                  {pdfFile ? (
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
                  ) : image ? (
                    <div
                      className={` grid p-4 align-middle place-items-center gap-1.5 overflow-clip`}
                    >
                      {loading && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-full w-full bg-white bg-opacity-40 grid place-items-center">
                          <SunIcon width={22} className="animate-spin " />
                        </div>
                      )}
                      <Image
                        alt=""
                        src={imageUrl}
                        width={500}
                        height={500}
                        className={`${
                          image.type.split("/")[1] === "png"
                            ? "bg-neutral-900 p-3"
                            : ""
                        } rounded-xl max-h-[60vh] h-auto object-contain`}
                      />
                      <div className="text-neutral-400 flex align-baseline place-items-center">
                        <p
                          className="md:max-w-[300px] max-w-[200px]
                     truncate"
                        >
                          {image?.name}
                        </p>
                        {/* <p>{image.type.split("/")[1]}</p> */}
                      </div>

                      <p className="text-neutral-600">
                        {formatFileSize(image?.size as number)}
                      </p>
                    </div>
                  ) : null}
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
                  <form
                    onSubmit={sendImageAction}
                    className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-neutral-800 rounded-lg max-w-md mx-auto"
                  >
                    <input
                      id="message"
                      name="message"
                      disabled={loading}
                      aria-disabled={loading}
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
                      disabled={loading}
                      aria-disabled={loading}
                      type="submit"
                      className="focus:outline-none col-span-2 border-secondary duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary text-white rounded-r-lg p-2 px-4 disabled:cursor-not-allowed disabled:bg-opacity-50"
                    >
                      <PaperAirplaneIcon width={25} />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 pb-8 gap-4 transition-all duration-400 p-4">
                <label
                  htmlFor="gallery"
                  className="cursor-pointer transition-all duration-500 hover:dark:bg-opacity-5 hover:border-orange-300 hover:dark:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-orange-100 text-orange-500 dark:bg-orange-400 dark:bg-opacity-10 rounded-3xl "
                >
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImage(file as File);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setImageUrl(url);
                      }
                    }}
                    type="file"
                    name="gallery"
                    id="gallery"
                    className="hidden"
                  />
                  <PhotoIcon width={30} />
                  <p className="text-xs">Gallery</p>
                </label>

                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-indigo-300 hover:dark:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:bg-opacity-10 rounded-3xl"
                  onClick={() => setOpenEcode(true)}
                >
                  <LockClosedIcon width={30} />
                  <p className="text-xs">E-Code</p>
                </DrawerClose>

                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-purple-300 hover:dark:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-purple-100 text-purple-500 dark:bg-purple-400 dark:bg-opacity-10 rounded-3xl"
                  onClick={() => setOpenAccount(true)}
                >
                  <CreditCardIcon width={30} />
                  <p className="text-xs">Account</p>
                </DrawerClose>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <ECodeComp id={id} openEcode={openEcode} setOpenEcode={setOpenEcode} />
      <AccountComp
        id={id}
        openAccount={openAccount}
        setOpenAccount={setOpenAccount}
      />
    </>
  );
};
export default AttachFile;

// sent && !(image || pdfFile) ? (
//               <div className="grid gap-3 transition-all duration-400 p-4">
//                 <DrawerHeader>Sent</DrawerHeader>
//                 <div>
//                   <SuccessCheckmark />
//                 </div>
//                 <DrawerClose
//                   className="bg-primary py-3 w-3/4 px-6 mx-auto rounded-lg text-white hover:border-pink-400 border-2 border-primary duration-300"
//                   onClick={() => {
//                     setSent(false);
//                     setImage(null);
//                     setPdfFile(null);
//                     setCaption("");
//                   }}
//                 >
//                   Close
//                 </DrawerClose>
//               </div>
//             ) :
