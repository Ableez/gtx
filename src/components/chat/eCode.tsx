import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendEcodeToAdmin } from "@/lib/utils/actions/userChat";
import { SunIcon } from "@heroicons/react/24/outline";
import type { Conversation } from "../../../chat";
import { v4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import { postToast } from "../postToast";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import useScrollRef from "@/lib/hooks/useScrollRef";

type Props = {
  chatId: string;
  openEcode: boolean;
  setOpenEcode: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  data?: Conversation;
  edit?: boolean;
  idx?: number;
};

const ECodeComp = ({
  data,
  openEcode,
  setOpenEcode,
  chatId,
  edit,
  idx,
  scrollToBottom,
}: Props) => {
  const [eCode, setEcode] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const updateConversation = useMessagesStore(
    (state) => state.updateConversation
  );

  const sendEcode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uc = Cookies.get("user");

    if (!uc) {
      postToast("User does not exists");
      return;
    }

    const user = JSON.parse(uc);

    try {
      setLoading(true);

      const res = await sendEcodeToAdmin(
        chatId,
        new FormData(e.target as HTMLFormElement),
        edit,
        idx
      );

      const msg = {
        id: v4(),
        timeStamp: new Date(), // replaced_date,
      };
      const newMessage = {
        id: msg.id,
        type: "card",
        deleted: false,
        sender: {
          username: user.displayName,
          uid: user.uid,
        },
        recipient: "admin",
        card: {
          title: "e-Code",
          data: {
            value: eCode,
          },
        },
        timeStamp: new Date(), // date_replaced,
        edited: false,
        read_receipt: {
          delivery_status: "not_sent",
          status: false,
          time: new Date(), // date_replaced,
        },
      };

      if (!edit) {
        updateConversation(
          {
            ...data,
            id: data?.id || "",
            messages: [...(data?.messages || []), newMessage],
          } as Conversation,
          scrollToBottom
        );
      }

      if (scrollToBottom.current?.lastElementChild) {
        scrollToBottom.current.lastElementChild.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (res.success) {
        setOpenEcode(false);
        setResp(res.message);
      } else {
        setResp(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setResp("");
    }
  };

  return (
    <Dialog open={openEcode} onOpenChange={setOpenEcode}>
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {edit && "Edit "}e-Code
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Enter the 16 digit code on your gift card
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form className="grid gap-4" onSubmit={sendEcode}>
            <Input
              id="ecode"
              value={eCode}
              disabled={loading}
              type="text"
              minLength={16}
              maxLength={19}
              required
              name="ecode"
              aria-label="E-Code"
              onChange={(e) => setEcode(e.target.value)}
              placeholder="●●●● ●●●● ●●●● ●●●●"
              autoComplete="off"
              className="border-neutral-300 dark:border-neutral-800 text-lg placeholder:text-neutral-300"
            />
            {resp && <p className="text-xs text-rose-500">{resp}</p>}
            <Button
              disabled={loading}
              className="flex align-middle place-items-center gap-2"
            >
              {loading && (
                <SunIcon
                  width={22}
                  className="animate-spin duration-1000 text-white"
                />
              )}
              {edit ? "Edit" : "Send"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ECodeComp;
