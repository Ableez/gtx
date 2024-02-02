import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SunIcon } from "@heroicons/react/24/outline";
import { Label } from "../ui/label";
import { Conversation } from "../../../chat";
import Image from "next/image";
import { sendConfirmTransactionToAdmin } from "@/lib/utils/actions/sendConfirmTransactionToAdmin";

type Props = {
  id: string;
  openConfirmTransaction: boolean;
  setOpenConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  data: Conversation;
  edit?: boolean;
  idx?: number;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const ConfirmTransaction = ({
  openConfirmTransaction,
  setOpenConfirmTransaction,
  id,
  data,
  edit,
  idx,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState("");

  const start = async (reason: boolean, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    try {
      const res = await sendConfirmTransactionToAdmin(id, reason, idx);

      if (res.success) {
        setOpenConfirmTransaction(false);
      } else {
        setResp(res.message);
      }
    } catch (err) {
      console.error(err);
      setResp("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={openConfirmTransaction}
      onOpenChange={setOpenConfirmTransaction}
    >
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {edit && "Edit "} Bank Details
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Please confirm the details below.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="my-4">
            <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
              <Image
                alt="Card logo"
                width={100}
                height={100}
                src={"/logoplace.svg"}
                className="w-8 p-1 bg-primary rounded-3xl"
              />
              <h4 className="md:text-xl text-base tracking-wide font-bold">
                {data?.transaction.cardDetails.vendor} Card
              </h4>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                    Subcategory
                  </dt>
                  <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                    {data?.transaction.cardDetails.subcategory ||
                      "Please wait..."}
                  </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                    You will be sending
                  </dt>
                  <dd className="flex align-middle items-center place-items-center justify-between">
                    <div className="mt-1 text-base font-semibold leading-6 text-black dark:text-white sm:col-span-2 sm:mt-0">
                      <span>&#x20A6;</span>
                      {data?.transaction.cardDetails.rate ||
                        "Please wait..."}{" "}
                      <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                        for{" "}
                        {data?.transaction.cardDetails.price ||
                          "Please wait..."}
                      </span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {resp && <p className="text-xs text-rose-500">{resp}</p>}
          <div>
            {!data?.transaction?.accountDetails?.accountNumber && (
              <p className="font-medium text-[10px] text-center text-rose-500">
                Request for bank details to continue
              </p>
            )}
            {!data?.transaction?.cardDetails?.rate && (
              <p className="font-medium text-[10px] text-center text-amber-500">
                You have not set the $ rate
              </p>
            )}
          </div>
          <form onSubmit={(e) => start(true, e)}>
            <Button
              disabled={
                loading || !data?.transaction?.accountDetails?.accountNumber
              }
              className="flex align-middle place-items-center gap-2 mt-4 w-full"
            >
              {loading && (
                <SunIcon
                  width={22}
                  className="animate-spin duration-1000 text-white"
                />
              )}
              Confirm
            </Button>
          </form>
        </div>
        <DialogClose
          onClick={() => {
            start(false);
          }}
        >
          Reject
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmTransaction;
