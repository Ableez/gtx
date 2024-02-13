"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";
import UserChatNav from "../userChatNav";
import RenderMessages from "./renderMessages";
import { User } from "firebase/auth";
import { SunIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AttachFile from "./AttachFile";
import { Conversation, Message } from "../../../chat";
import { Button } from "../ui/button";
import UserChatContainer from "./ChatContainer";
import Link from "next/link";

type Props = {
  allMessages?: Conversation;
  user: User;
  sendMessageAction: Function;
  updateMessages: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  setNewMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
  id: string;
};

const UserChatWrapper = ({
  user,
  allMessages,
  sendMessageAction,
  updateMessages,
  scrollToBottom,
  setNewMessage,
  id,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formAction = (e: FormData) => {
    if (message.length === 0) return;
    setLoading(true);

    formRef?.current?.reset();

    sendMessageAction(e).then(
      (res: { error: React.SetStateAction<string> }) => {
        if (res?.error) setError(res?.error);
        setLoading(false);

        if (scrollToBottom.current) {
          scrollToBottom.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    );
  };

  return (
    <div className="box-border overflow-clip">
      <UserChatContainer
        allMessages={allMessages}
        id={id}
        scrollToBottom={scrollToBottom}
      />
      {error && error}
      {allMessages?.chatStatus === "closed" ? (
        <div className="text-xs p-2 left-1/2 -translate-x-1/2 fixed bottom-0 w-screen py-1.5 bg-primary text-center text-white">
          <em>This coversation is over</em>{" "}
          <Link href={"/support"}>Report an issue</Link>
        </div>
      ) : (
        <div className=" bg-neutral-50 left-1/2 -translate-x-1/2 dark:bg-neutral-800 fixed bottom-0 w-screen py-1.5 border">
          <form
            ref={formRef}
            onSubmit={() => setMessage("")}
            action={async (e: FormData) => formAction(e)}
            className="grid grid-cols-12 grid-flow-col gap-1 align-middle place-items-center justify-between max-w-xl mx-auto"
          >
            {selectedFile && (
              <div className="absolute bg-neutral-900 p-4 rounded-xl left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  title="Cancel"
                  className="bg-neutral-700 p-2 rounded-full"
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  <XMarkIcon width={20} />
                </button>
                {selectedFile.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt={selectedFile.name}
                    width={100}
                    height={100}
                  />
                ) : (
                  selectedFile.name
                )}
              </div>
            )}
            <AttachFile
              scrollToBottom={scrollToBottom}
              id={id}
              formRef={formRef}
              message={allMessages}
            />
            <textarea
              rows={1}
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoCorrect="true"
              autoComplete="off"
              className={`font-medium transition-all duration-300 bg-neutral-200 dark:bg-neutral-800 resize-none leading-4 text-sm antialiased focus:outline-none col-span-9 md:col-span-10 w-full h-fit p-3 rounded-xl`}
              placeholder="Enter a message..."
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
            />

            <button
              disabled={loading || message.length === 0}
              type="submit"
              className="focus:outline-none col-span-2 md:col-span-1 border-secondary rounded-xl duration-300 w-full h-full py-1 grid place-items-center align-middle bg-secondary disabled:bg-purple-300 text-white"
              title={loading ? "Sending..." : "Send Message"}
            >
              {loading ? (
                <SunIcon className="animate-spin duration-1000 text-xl" />
              ) : (
                <PaperAirplaneIcon width={25} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserChatWrapper;
