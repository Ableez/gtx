import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  PencilIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Conversation } from "../../../../chat";
import Image from "next/image";
import SetRateComp from "./setRateDialog";
import { startTransaction } from "@/lib/utils/adminActions/startTransaction";

type Props = {
  id: string;
  openStartTransaction: boolean;
  card: Conversation | undefined;
  setOpenStartTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  update?: {
    status: string;
  };
  resend?: boolean;
};

const StartAdminTransaction = ({
  card,
  openStartTransaction,
  setOpenStartTransaction,
  id,
  scrollToBottom,
  resend,
  update,
}: Props) => {
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [openRate, setOpenRate] = useState(false);

  const start = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await startTransaction(id, update, resend);

      if (res.success) {
        setOpenStartTransaction(false);
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

  const started = () => {
    if (card) {
      if (card.transaction.started && card.transaction.status === "pending") {
        return true;
      } else {
        false;
      }
    }

    return false;
  };
  return (
    <>
      <Dialog
        open={openStartTransaction}
        onOpenChange={setOpenStartTransaction}
      >
        <DialogContent className="w-[95vw] max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Start Transaction
            </DialogTitle>
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
                  {card?.transaction.cardDetails.vendor} Card
                </h4>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700">
                <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                      Subcategory
                    </dt>
                    <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                      {card?.transaction.cardDetails.subcategory ||
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
                        {card?.transaction.cardDetails.rate || "0.00"}{" "}
                        <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                          for{" "}
                          {card?.transaction.cardDetails.price ||
                            "Please wait..."}
                        </span>
                      </div>
                      <div>
                        <DialogClose onClick={() => setOpenRate(true)}>
                          <Button
                            variant={"ghost"}
                            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-300 border"
                          >
                            {card?.transaction.cardDetails.rate ? (
                              <div className="flex align-middle place-items-center justify-between gap-1">
                                Edit <PencilIcon width={14} />
                              </div>
                            ) : (
                              <div className="flex align-middle place-items-center justify-between gap-1">
                                Set rate <CurrencyDollarIcon width={16} />
                              </div>
                            )}
                          </Button>
                        </DialogClose>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            {resp && <p className="text-xs text-rose-500">{resp}</p>}
            <div>
              {!card?.transaction?.accountDetails?.accountNumber && (
                <p className="font-medium text-[10px] text-center text-rose-500">
                  Request for bank details to continue
                </p>
              )}
              {!card?.transaction?.cardDetails?.rate && (
                <p className="font-medium text-[10px] text-center text-red-500">
                  You have not set the $ rate
                </p>
              )}
            </div>
            <form onSubmit={(e) => start(e)}>
              <Button
                disabled={
                  loading ||
                  !card?.transaction?.accountDetails?.accountNumber ||
                  !card?.transaction.cardDetails.rate ||
                  started()
                }
                className="flex align-middle place-items-center gap-2 mt-4 w-full"
              >
                {loading && (
                  <SunIcon
                    width={22}
                    className="animate-spin duration-1000 text-white"
                  />
                )}
                {started() ? "Waiting for customer" : "Confirm"}
              </Button>
            </form>
          </div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SetRateComp
        edit={card?.transaction?.cardDetails.rate ? true : false}
        scrollToBottom={scrollToBottom}
        id={id}
        openRate={openRate}
        setOpenRate={setOpenRate}
        card={card?.transaction?.cardDetails}
      />
    </>
  );
};

export default StartAdminTransaction;
