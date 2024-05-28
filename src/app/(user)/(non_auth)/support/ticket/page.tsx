"use client";
import { postToast } from "@/components/postToast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitTicket } from "@/lib/utils/actions/submitTicket";
import { fileToObject, objectToFile } from "@/lib/utils/fileConverter";
import {
  ArrowLeftIcon,
  BugAntIcon,
  CheckIcon,
  ChevronDownIcon,
  CreditCardIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

type Props = {};

type Images = {
  data: string;
  name: string;
  type: string;
}[];

const isBrowser = typeof window !== "undefined";

const storedImages = isBrowser ? window.localStorage.getItem("images") : "";

const u = Cookies.get("user");
const user = u ? JSON.parse(u) : null;

const TicketPage = (props: Props) => {
  const [ticketType, setTicketType] = useState("Bug report");
  const [images, setImages] = useState<Images>(
    storedImages ? JSON.parse(storedImages) : []
  );
  const [mounted, setMounted] = useState(false);
  const [description, setDescription] = useState("");
  const [fullname, setFullname] = useState(user ? user.displayName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (description || images.length > 1) {
        alert("You have unsaved changes.");
      }

      localStorage.removeItem("images");
    };

    // Add event listener when component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [description, images.length]);

  if (!mounted) {
    return (
      <div className="flex gap-1 h-24 text-center text-xs place-items-center justify-center align-middle">
        <SunIcon width={18} className="animate-spin text-pink-500" />
        Please wait...
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <div className="mb-6 flex align-middle place-items-center justify-start gap-3">
        <h2 className="text-2xl font-bold">New ticket</h2>
      </div>

      <div className="grid grid-flow-row gap-8">
        <div className="grid grid-flow-row gap-4">
          <Drawer>
            <DrawerTrigger className="bg-neutral-200 dark:bg-black bg-opacity-60  p-3 rounded-md flex align-middle place-items-center justify-between">
              <div className="text-left">
                <h6 className="text-[10px] text-neutral-500">Ticket type</h6>
                <h4 className="font-medium">{ticketType}</h4>
              </div>

              <ChevronDownIcon width={14} />
            </DrawerTrigger>
            <DrawerContent className="p-4 max-w-md mx-auto">
              <DrawerHeader>
                <DrawerTitle>Ticket type</DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-flow-row gap-0.5">
                <DrawerClose
                  title="Report a technial issue"
                  type="submit"
                  onClick={() => {
                    setTicketType("Bug report");
                  }}
                  className="flex align-middle place-items-center hover:px-3.5 duration-150 justify-start gap-4 p-4"
                >
                  <BugAntIcon
                    className="text-fuchsia-700 dark:text-fuchsia-500"
                    width={24}
                  />
                  <h4>Bug report</h4>
                </DrawerClose>
                <DrawerClose
                  title="Transaction issues"
                  type="submit"
                  onClick={() => {
                    setTicketType("Transaction issues");
                  }}
                  className="flex align-middle place-items-center hover:px-3.5 duration-150 justify-start gap-4 p-4"
                >
                  <CreditCardIcon className="text-rose-500" width={24} />
                  <h4>Transaction issues</h4>
                </DrawerClose>
                <DrawerClose
                  title="Improvement suggestion"
                  type="submit"
                  onClick={() => {
                    setTicketType("Improvement suggestion");
                  }}
                  className="flex align-middle place-items-center hover:px-3.5 duration-150 justify-start gap-4 p-4"
                >
                  <SparklesIcon className="text-blue-500" width={24} />
                  <h4>Improvement suggestion</h4>
                </DrawerClose>
                <DrawerClose
                  title="Ask a question"
                  type="submit"
                  onClick={() => {
                    setTicketType("Question");
                  }}
                  className="flex align-middle place-items-center hover:px-3.5 duration-150 justify-start gap-4 p-4"
                >
                  <QuestionMarkCircleIcon
                    className="text-yellow-500"
                    width={24}
                  />
                  <h4>Question</h4>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
          <div className="relative rounded-md bg-neutral-200 dark:bg-black bg-opacity-60 dark:text-neutral-200 pt-6 px-2 pb-1 flex align-middle place-items-center justify-between outline-none caret-black w-full">
            <label
              className="z-10 absolute text-[10px] left-4 top-2 text-neutral-500"
              htmlFor="ticketType"
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              title="Explain here..."
              className="outline-none w-full resize-none bg-transparent text-sm px-2"
            />
          </div>
        </div>

        <div>
          <div className="flex align-middle place-items-center justify-start flex-wrap gap-4">
            {mounted && images && images?.length > 0 && (
              <>
                {images.map((img, idx) => {
                  const src = URL.createObjectURL(objectToFile(img));
                  return (
                    <div
                      key={idx}
                      className="aspect-[5/8] w-fit grid place-items-center align-middle justify-center rounded-md bg-neutral-100 bg-opacity-60 hover:bg-opacity-100 duration-200 relative border"
                    >
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="absolute top-0 right-0 bg-opacity-60 backdrop-blur-md hover:bg-opacity-70 bg-white "
                        onClick={() => {
                          if (images.length > 1) {
                            setImages([
                              ...images.slice(0, idx),
                              ...images.slice(idx + 1),
                            ]);
                          } else {
                            setImages([]);
                          }
                        }}
                      >
                        <XMarkIcon width={16} />
                      </Button>
                      <Image
                        alt="Complaint image"
                        src={src}
                        width={100}
                        height={100}
                        className="max-h-40 h-auto w-auto object-cover rounded-md"
                      />
                    </div>
                  );
                })}
              </>
            )}
            {images.length < 3 && (
              <Label
                htmlFor="image"
                className="p-6 aspect-[5/8] border-2 border-dashed border-neutral-200 hover:border-neutral-300 dark:border-neutral-600 hover:dark:border-neutral-500 w-fit grid place-items-center align-middle justify-center rounded-md bg-neutral-100  dark:bg-black bg-opacity-60 hover:bg-opacity-100 duration-200"
              >
                <div className="p-2 w-fit rounded-full bg-neutral-200 dark:bg-black">
                  <PlusIcon width={16} />
                </div>

                <Input
                  onChange={async (e) => {
                    if (!e.target.files) {
                      postToast("error", {
                        description: "File type not supported",
                      });
                      return;
                    }

                    if (e.target.files && e.target.files[0]) {
                      if (e.target.files[0].size > 5000000) {
                        postToast("Attention", {
                          description: "Image size limit is 5MB",
                        });
                        return;
                      }

                      const file = await fileToObject(e.target.files[0]);
                      if (file) {
                        setImages((prev) => [...(prev || []), file]);
                        localStorage.setItem("images", JSON.stringify(images));
                      }
                    }
                  }}
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  className="hidden"
                />
              </Label>
            )}
          </div>

          <h6
            className={`${
              images.length === 3 && "text-rose-600"
            } text-xs text-neutral-500 mt-4`}
          >
            Max 3 images.
          </h6>
        </div>
      </div>
      <AlertDialog open={sent} onOpenChange={setSent}>
        {description.trim().length > 2 ? (
          <AlertDialogTrigger asChild>
            <Button className="w-full sm:w-fit duration-300 rounded-md text-white font-medium my-8 bg-primary">
              Submit
            </Button>
          </AlertDialogTrigger>
        ) : (
          <Button
            className="w-full sm:w-fit duration-300 rounded-md text-white cursor-not-allowed font-medium my-8"
            disabled
          >
            Submit
          </Button>
        )}
        <AlertDialogContent>
          {loading && <Loading />}
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-4">
              Please enter your details
            </AlertDialogTitle>
          </AlertDialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              submitTicket(
                ticketType,
                description,
                JSON.stringify(images),
                email,
                fullname
              )
                .then((res) => {
                  if (res.success) {
                    postToast("Done", {
                      description: `${res.message}. We will get back to you in the next 24hrs to 48hrs`,
                    });
                    window.location.href = "/support";
                    setSent(false);
                  }
                  if (!res.success) {
                    postToast("Error", { description: res.message });
                    setSent(true);
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  onChange={(e) => setFullname(e.target.value)}
                  type="text"
                  value={fullname}
                  required={true}
                  placeholder="Fullname"
                  disabled={user}
                />
              </div>
              <div>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  required={true}
                  placeholder="Email"
                  disabled={user}
                />
              </div>
            </div>
            {user && (
              <h6 className="text-green-500 text-[10px] my-2 font-semibold flex align-middle place-items-center gap-1">
                <CheckBadgeIcon width={16} />{" "}
                <span>You are an active user</span>
              </h6>
            )}

            <div className="flex align-middle place-items-center justify-between gap-4 w-full">
              <AlertDialogCancel
                className="w-full sm:w-fit mt-4 hover:text-neutral-600"
                type="button"
              >
                Close
              </AlertDialogCancel>
              <Button
                className="w-full sm:w-fit mt-4 ring-4 ring-transparent hover:ring-pink-200"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketPage;
