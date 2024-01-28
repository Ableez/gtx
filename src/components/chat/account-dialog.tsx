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

type Props = {
  id: string;
  openAccount: boolean;
  setOpenAccount: React.Dispatch<React.SetStateAction<boolean>>;
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
  id,
  data,
  edit,
  idx,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(data);

  const sendAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await sendAccountToAdmin(
        id,
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
          <DialogTitle className="text-2xl font-medium text-neutral-800">
            Bank Details
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
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

            {error && error}

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
              Send
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountComp;
