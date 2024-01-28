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
import { SunIcon } from "@heroicons/react/24/solid";

type Props = {
  id: string;
  openEcode: boolean;
  setOpenEcode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ECodeComp = ({ openEcode, setOpenEcode, id }: Props) => {
  const [eCode, setEcode] = useState(0);
  const [resp, setResp] = useState("");
  const sendEcode = sendEcodeToAdmin.bind(null, id);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={openEcode} onOpenChange={setOpenEcode}>
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-neutral-400">
            Enter Your E-Code
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            Enter the 16 digit code on your gift card
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            className="grid gap-4"
            action={async (e) => {
              setLoading(true);
              console.log("Starsted");
              sendEcode(e)
                .then((res) => {
                  console.log(res);
                  setLoading(false);
                })
                .catch(() => {
                  setLoading(false);
                });
            }}
          >
            <Input
              id="ecode"
              disabled={loading}
              type="number"
              name="ecode"
              onChange={(e) => setEcode(Number(e.target.value))}
              placeholder="Enter E-Code"
              minLength={16}
              className="border-neutral-    300 dark:border-neutral-800"
            />
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

export default ECodeComp;
