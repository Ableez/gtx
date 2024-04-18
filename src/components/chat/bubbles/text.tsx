import React from "react";
import { Message } from "../../../../chat";
import { formatTime } from "@/lib/utils/formatTime";
import { ClockIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

type Props = {
  message: Message;
  idx: number;
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const TextMessage = ({ idx, message }: Props) => {
  return (
    <div
      key={idx}
      className={`max-w-[320px] md:max-w-[500px] transition-all duration-500 px-2 ${
        message.sender.uid === user.uid
          ? "justify-self-end"
          : "justify-self-start"
      }`}
    >
      <div
        className={`${
          message.sender.uid === user.uid
            ? "bg-secondary text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
            : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200/50 dark:bg-neutral-800"
        } flex align-middle place-items-end justify-between px-3 gap-2 py-1.5`}
      >
        <div className="flex align-middle place-items-end gap-4">
          <p className={`text-sm`}>
            {message.content.text}
            <br />
          </p>
          <p className="text-[8px] font-light leading-3">
            {message.read_receipt.delivery_status === "not_sent" ? (
              <ClockIcon width={14} />
            ) : (
              formatTime(
                new Date(
                  (message?.timeStamp?.seconds ?? 0) * 1000 +
                    (message?.timeStamp?.nanoseconds ?? 0) / 1e6
                ).toISOString()
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
