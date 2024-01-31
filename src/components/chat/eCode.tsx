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
import { Conversation } from "../../../chat";

type Props = {
  id: string;
  openEcode: boolean;
  setOpenEcode: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  data: Conversation;
  edit?: boolean;
  idx?: number;
};

const ECodeComp = ({ data, openEcode, setOpenEcode, id, edit, idx }: Props) => {
  const [eCode, setEcode] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEcode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await sendEcodeToAdmin(
        id,
        new FormData(e.target as HTMLFormElement),
        data,
        edit,
        idx
      );

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
              disabled={loading}
              type="text"
              maxLength={19}
              name="ecode"
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
