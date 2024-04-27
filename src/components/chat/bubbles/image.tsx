import { formatTime } from "@/lib/utils/formatTime";
import { ClockIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import { Message } from "../../../../chat";
import Cookies from "js-cookie";

type Props = {
  message: Message;
  setCurrId: React.Dispatch<React.SetStateAction<string>>;
  setOpenSlide: React.Dispatch<React.SetStateAction<boolean>>;
};

const cachedUser = Cookies.get("user");
const user = JSON.parse(cachedUser || "{}");

const ImageBubble = ({ message, setCurrId, setOpenSlide, }: Props) => {
  if (message.content.media.url)
    return (
      <>
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
                <Image
                  src={message.content.media?.url || "/logoplace.svg"}
                  alt={message.content.media?.metadata?.media_name as string}
                  width={220}
                  height={220}
                  priority={true}
                  className="w-full max-h-[420px] bg-slate-200 dark:bg-neutral-800"
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
            {message.content.media?.caption && (
              <div
                className={`md:font-medium font-normal leading-6 text-sm antialiased text-right w-full mr-2`}
              >
                {message.content.media?.caption}
              </div>
            )}
          </div>
        </div>
      </>
    );
};
// };

export default ImageBubble;
