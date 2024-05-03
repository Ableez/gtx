import { formatTime } from "@/lib/utils/formatTime";
import {
  ClockIcon,
  EllipsisVerticalIcon,
  PhotoIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import { Message } from "../../../../chat";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { postToast } from "@/components/postToast";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type Props = {
  message: Message;
  setCurrId: React.Dispatch<React.SetStateAction<string>>;
  setOpenSlide: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const cachedUser = Cookies.get("user");
const user = JSON.parse(cachedUser || "{}");

const ImageBubble = ({
  message,
  setCurrId,
  setOpenSlide,
  scrollToBottom,
}: Props) => {
  if (message.content.media.url)
    return (
      <div
        className={`${
          message.sender.uid === user.uid
            ? "justify-self-end"
            : "justify-self-start"
        } flex align-middle place-items-center gap-2`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <EllipsisVerticalIcon width={18} className="rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="flex align-middle place-items-center gap-2"
              onClick={() => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = "blob";

                xhr.onprogress = (event) => {
                  postToast("", {
                    description: (
                      <div className="flex align-middle place-items-center gap-2">
                        <SunIcon width={18} className="animate-spin" />
                        <Progress value={event.loaded} max={event.total} />
                        {Math.round((event.loaded * 100) / event.total) + "%"}
                      </div>
                    ),
                    duration: 100000,
                    id: "download-toast",
                  });
                };

                xhr.onload = (event) => {
                  const blob = xhr.response;

                  const url = URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = url;
                  link.click();

                  toast.dismiss("download-toast");
                  postToast("✔️ Done", {
                    duration: 1200,
                    id: "download-progress",
                  });
                };
                xhr.open("GET", message.content.media.url);
                xhr.send();

                xhr.onerror = (e) => {
                  toast.dismiss("download-toast");
                  toast.dismiss("download-progress");
                  postToast("❌ Could not download image", { duration: 2500 });
                  console.log("ERROR DOWNLOADING IMAGE", e);
                };
              }}
            >
              <DownloadIcon /> Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          className={`max-w-[250px] md:max-w-[500px] transition-all duration-500 px-2 ${
            message.sender.uid === user.uid
              ? "justify-self-end"
              : "justify-self-start"
          }`}
          onClick={() => {
            setCurrId(message.id);
            setOpenSlide(true);
          }}
        >
          <div
            className={`${
              message.sender.uid === user.uid
                ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
                : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-100 dark:bg-neutral-800"
            } grid align-middle place-items-center justify-between px-1 gap-2 py-1 min-w-[100px] min-h-[100px]`}
          >
            <div className="rounded-sm overflow-clip shadow-md bg-white relative">
              <div className="w-full h-16 absolute bottom-0 left-0 from-transparent to-black/60 bg-gradient-to-b" />
              <h4 className="absolute bottom-2 text-white right-4 text-xs">
                {message?.read_receipt.delivery_status === "not_sent" ? (
                  <ClockIcon width={14} />
                ) : (
                  formatTime(
                    new Date(
                      (message?.timeStamp?.seconds ?? 0) * 1000 +
                        (message?.timeStamp?.nanoseconds ?? 0) / 1e6
                    ).toISOString()
                  )
                )}
              </h4>
              {message.content.media?.url ? (
                <div
                  className={`flex align-middle place-items-center justify-between gap-4 ${
                    message.sender.uid === user.uid ? "" : "justify-self-start"
                  }`}
                >
                  <Image
                    src={message.content.media?.url || "/logoplace.svg"}
                    alt={message.content.media?.metadata?.media_name as string}
                    width={400}
                    height={400}
                    autoSave="true"
                    priority={true}
                    id={message.id}
                    onLoad={() => {
                      scrollToBottom.current?.lastElementChild?.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                      });
                    }}
                    className="w-full max-h-[420px] bg-slate-200 dark:bg-neutral-800 select-all"
                  />
                </div>
              ) : (
                <div className="flex align-middle place-items-center justify-center w-full h-full">
                  <PhotoIcon
                    width={120}
                    className="opacity-70 text-neutral-50"
                  />
                </div>
              )}
            </div>
            {message.content.media?.caption && (
              <div
                className={`md:font-medium font-normal leading-6 text-sm antialiased text-right w-full mr-2`}
              >
                {message.content.media?.caption}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};
// };

export default ImageBubble;
