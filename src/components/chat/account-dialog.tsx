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
import { sendAccountToAdmin } from "@/lib/utils/actions/userChat";
import { SunIcon } from "@heroicons/react/24/outline";
import { Label } from "../ui/label";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import { v4 } from "uuid";
import type { Conversation } from "../../../chat";
import Cookies from "js-cookie";
import { postToast } from "../postToast";
import { Timestamp } from "firebase/firestore";
import { getCustomTimestamp } from "@/lib/utils/custom-timestamp";

type Props = {
  chatId: string;
  openAccount: boolean;
  setOpenAccount: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  allMessages: Conversation;
  data?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
  edit?: boolean;
  idx?: number;
};

const AccountComp = ({
  openAccount,
  setOpenAccount,
  allMessages,
  chatId,
  data,
  edit,
  idx,
  scrollToBottom,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(data);

  const updateConversation = useMessagesStore(
    (state) => state.updateConversation
  );

  const sendAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const uc = Cookies.get("user");

    if (!uc) {
      postToast("User not found");

      return;
    }
    const user = JSON.parse(uc);

    const eData = new FormData(e.target as HTMLFormElement);

    const accountNumber = eData.get("accountNumber");
    const accountName = eData.get("accountName");
    const bankName = eData.get("bankName");

    const accountDetails = {
      accountName: accountName?.toString(),
      accountNumber: accountNumber?.toString(),
      bankName: bankName?.toString(),
    };

    const msg = {
      id: v4(),
      timeStamp: getCustomTimestamp(), // replaced_date,
    };

    const allmsg = { ...allMessages.messages, timeStamp: getCustomTimestamp() };

    if (!edit) {
      updateConversation(
        {
          ...allMessages,
          messages: [
            ...allmsg,
            {
              id: msg.id,
              type: "card",
              deleted: false,
              sender: {
                username: user.displayName,
                uid: user.uid,
              },
              recipient: "admin",
              card: {
                title: "Account Details",
                data: accountDetails,
              },
              content: {
                text: "",
                media: {
                  text: "",
                  metadata: {
                    media_name: "",
                    media_size: "",
                    media_type: "",
                  },
                  url: "",
                },
              },
              timeStamp: getCustomTimestamp(), // date_replaced,
              edited: false,
              read_receipt: {
                delivery_status: "sent",
                status: false,
                time: getCustomTimestamp(), // date_replaced,
              },
            },
          ],
          updated_at: getCustomTimestamp(), // date_replaced,
          transaction: {
            ...allMessages.transaction,
            accountDetails: {
              accountName: accountName?.toString() as string,
              accountNumber: Number(accountNumber?.toString()),
              bankName: bankName?.toString() as string,
            },
          },
        },
        scrollToBottom
      );
    }

    try {
      const res = await sendAccountToAdmin(
        chatId,
        new FormData(e.target as HTMLFormElement),
        edit,
        idx
      );

      if (res.success) {
        setOpenAccount(false);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openAccount} onOpenChange={setOpenAccount}>
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {edit && "Edit "} Bank Details
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            We will make transfer to this account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form className="grid gap-4" onSubmit={sendAccount}>
            <div className="grid gap-2">
              <Label className="text-neutral-500">Account Number</Label>
              <Input
                required
                id="accountNumber"
                minLength={11}
                maxLength={11}
                disabled={loading}
                defaultValue={formData?.accountNumber || ""}
                type="number"
                name="accountNumber"
                className="border-neutral-300 text-sm placeholder:text-base dark:border-neutral-800"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-neutral-500">Account Name</Label>
              <Input
                required
                id="accountName"
                minLength={3}
                disabled={loading}
                defaultValue={formData?.accountName || ""}
                type="text"
                name="accountName"
                className="border-neutral-300 text-sm placeholder:text-base dark:border-neutral-800"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-neutral-500">Bank Name</Label>
              <Input
                required
                id="bankName"
                disabled={loading}
                defaultValue={formData?.bankName || ""}
                type="text"
                name="bankName"
                className="border-neutral-300 text-sm placeholder:text-base dark:border-neutral-800"
              />
            </div>

            {error && <p className="text-xs text-rose-500">Error: {error}</p>}

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

export default AccountComp;
