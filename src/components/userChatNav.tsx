/* eslint-disable @next/next/no-img-element */
import React from "react";
import ReviewDrawer from "./chat/reviewDrawer";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { useMessagesStore } from "@/lib/utils/store/userConversation";

const UserChatNav = () => {
  const { conversation } = useMessagesStore();

  return (
    <nav className="sticky border-b max-w-screen-md mx-auto top-0 flex align-middle justify-between gap-2 place-items-center py-2 z-50 px-2 bg-[#f5f5f5] dark:bg-[#222222]">
      <div className="flex align-middle place-items-center gap-2">
        <ReviewDrawer />
        <h4 className="text-lg font-semibold">Chat</h4>
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Card Details</Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] rounded-2xl">
            {conversation?.transaction.crypto ? (
              <Card className="border-none shadow-none dark:bg-black">
                <CardHeader>
                  <CardTitle className="md:text-2xl text-base tracking-wide dark:text-neutral-400">
                    Crypto Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
                    <Image
                      alt="Card logo"
                      width={100}
                      height={100}
                      src={
                        conversation?.transaction.cryptoData.image ||
                        "/logoplace.svg"
                      }
                      className="w-8 p-0.5 bg-neutral-200 rounded-3xl"
                    />
                    <h4 className="md:text-xl text-base tracking-wide font-bold">
                      {conversation?.transaction.cryptoData.name}
                    </h4>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700">
                    <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                          Price
                        </dt>
                        <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                          {conversation?.transaction.cryptoData.price ||
                            "Please wait..."}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-none dark:bg-black">
                <CardHeader>
                  <CardTitle className="md:text-2xl text-base tracking-wide dark:text-neutral-400">
                    Card Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
                    <Image
                      alt="Card logo"
                      width={100}
                      height={100}
                      src={
                        conversation?.transaction.cardDetails.image ||
                        "/logoplace.svg"
                      }
                      className="w-8 p-0.5 bg-neutral-200 rounded-3xl"
                    />
                    <h4 className="md:text-xl text-base tracking-wide font-bold">
                      {conversation?.transaction.cardDetails.vendor} Card
                    </h4>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700">
                    <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                          Subcategory
                        </dt>
                        <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                          {conversation?.transaction.cardDetails.subcategory
                            .value || "Please wait..."}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                          Price
                        </dt>
                        <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                          {conversation?.transaction.cardDetails.price ||
                            "Please wait..."}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default UserChatNav;
