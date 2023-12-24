"use client";
import { useEffect, useState, useCallback, BaseSyntheticEvent } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/utils/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// types
type Message = {
  id: string;
  user_id: string;
  messages: {
    sender: string;
    text: string;
    sent_at: Date;
    media: string;
  }[];
  lastMessage: {
    timeStamp: {
      seconds: number;
      nanoseconds: number;
    };
    media: boolean;
    text: string;
  };
  transactions: object;
};

type Props = {
  params: {
    chatId: string;
  };
};

const UserChatScreen = ({ params }: Props) => {
  const [messages, setMessages] = useState<Message>();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const router = useRouter();

  const fetchChatData = useCallback(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Messages", params.chatId),
      (doc) => {
        if (doc.exists()) {
          setMessages(doc.data() as Message);
        } else {
          console.log("error fetching chat data");
          router.push("/sell");
        }
      }
    );

    return () => unsubscribe();
  }, [params.chatId, router]);

  useEffect(() => {
    fetchChatData();
  }, []);

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    setCurrentMessage(value);
  };

  const sendMessage = async () => {
    try {
      if (currentMessage === "") {
        return;
      }

      setCurrentMessage("");
      const messagesRef = doc(db, "Messages", params.chatId);

      // Update the messages array and lastMessage fields
      await updateDoc(messagesRef, {
        messages: arrayUnion({
          sender: "admin",
          text: currentMessage,
          sent_at: new Date(),
          media: "",
        }),
        lastMessage: {
          timeStamp: new Date(),
          media: false,
          text: currentMessage,
        },
      });

      setCurrentMessage(""); // Clear the input after sending the message
      fetchChatData();
    } catch (error) {
      console.error(error);
    }
  };

  // MESSAGES
  const renderMessages = () => {
    return messages?.messages.map((message, idx) => {
      return (
        <li
          key={idx}
          style={{
            lineHeight: "110%",
          }}
          className={`flex ${
            message.sender === "admin"
              ? "justify-start bggre"
              : "justify-end bggre"
          }}`}
        >
          <div
            className={`${
              message.sender === "admin"
                ? "bg-white text-black dark:bg-neutral-700 dark:text-white"
                : "bg-secondary text-white"
            } relative max-w-[320px] md:max-w-[564px] px-3 py-1.5 text-neutral-800 rounded-[18px] break-words text-sm overflow-x-hidden`}
          >
            <span className="block">{message.text}</span>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="overflow-hidden h-auto">
      <ul className="space-y-2 px-4 my-20">{renderMessages()}</ul>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex py-2 fixed bottom-0 w-full place-items-center justify-center gap-1 px-4 z-[9999] bg-neutral-200/40 dark:bg-neutral-800 border-t dark:border-neutral-600"
      >
        <div className="bg-neutral-50 dark:bg-neutral-800 dark:border dark:border-neutral-600 w-full flex align-middle place-items-center rounded-3xl px-2">
          <Input
            value={currentMessage}
            onChange={(e) => handleInputChange(e)}
            placeholder="Send message..."
            className="rounded-full py-6 shadow-none focus-visible:ring-0 text-[16px] font-semibold border-none dark:text-white text-neutral-800 "
          />

          <Dialog>
            <DialogTrigger className="p-2">
              <LinkIcon width={25} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a transaction</DialogTitle>
                <DialogDescription>Enter details below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="card" className="text-right">
                    Card
                  </Label>
                  <select id="card" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subcategory" className="text-right">
                    Subcategory
                  </Label>
                  <select id="subcategory" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Start</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          className="h-full rounded-3xl py-2.5"
          onClick={() => sendMessage()}
          variant={"ghost"}
        >
          <PaperAirplaneIcon width={28} />
        </Button>
      </form>
    </div>
  );
};

export default UserChatScreen;
