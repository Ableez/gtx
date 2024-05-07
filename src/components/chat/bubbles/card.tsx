import React, { useState } from "react";
import { CardDetails, Conversation, Message } from "../../../../chat";
import { Button } from "@/components/ui/button";
import AccountComp from "../account-dialog";
import Image from "next/image";
import ECodeComp from "../eCode";
import { ClockIcon, EyeIcon } from "@heroicons/react/24/outline";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import ConfirmTransaction from "../ConfirmTransaction";
import CardComponent from "./card_comp";
import Cookies from "js-cookie";

type Props = {
  message: Message;
  idx: number;
  data: Conversation;
  card: CardDetails;
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const CardMessage = ({
  idx,
  message,
  data,
  card,
  chatId,
  scrollToBottom,
}: Props) => {
  const [openAccount, setOpenAccount] = useState(false);
  const [openEcode, setOpenEcode] = useState(false);
  const [hideCode, setHideCode] = useState(true);
  const [openConfirmTransaction, setOpenConfirmTransaction] = useState(false);

  return (
    <>
      <div
        key={idx}
        className={`my-3 relative md:max-w-[350px] max-w-[260px] min-w-[200px] transition-all duration-500 flex align-middle place-items-end rounded-b-2xl justify-between gap-2 bg-purple-200/50 dark:bg-black shadow-s ${
          message.sender.uid === user.uid
            ? "justify-self-end rounded-tl-2xl rounded-tr-[3px] mr-2"
            : "justify-self-start rounded-tr-2xl rounded-tl-[3px] ml-2"
        } `}
      >
        {message.card.title === "Account Details" && (
          <CardComponent
            footer={
              <>
                <Button onClick={() => setOpenAccount(true)}>Edit</Button>
                <AccountComp
                  scrollToBottom={scrollToBottom}
                  allMessages={data}
                  chatId={chatId}
                  data={{
                    accountNumber: message?.card?.data?.accountNumber,
                    accountName: message?.card?.data?.accountName,
                    bankName: message?.card?.data?.bankName,
                  }}
                  idx={idx}
                  edit={true}
                  openAccount={openAccount}
                  setOpenAccount={setOpenAccount}
                />
              </>
            }
            title={"Account Details"}
            key={idx}
          >
            <div>
              <dl className="divide-y divide-pink-700/10 dark:divide-neutral-800">
                <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                  <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                    Account Number
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                    {message.card.data?.accountNumber}
                  </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                  <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                    Account Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                    {message.card.data?.accountName}
                  </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                  <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                    Account Bank
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                    {message.card.data?.bankName}
                  </dd>
                </div>
              </dl>
            </div>
          </CardComponent>
        )}

        {message.card.title === "card_detail" && (
          <CardComponent title={"Card Details"} key={idx}>
            <>
              <div className="flex pb-2 align-middle place-items-center justify-start gap-3 ">
                <div className="relative">
                  <Image
                    alt="Card logo"
                    width={120}
                    height={120}
                    src={message?.card?.data?.image || "/logoplace.svg"}
                    className="w-8 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl border-2"
                  />
                  <div className="absolute bottom-0 right-0">
                    <Image
                      alt="Subcategory logo"
                      width={30}
                      height={30}
                      src={
                        message?.card?.data?.subcategory?.image ||
                        "/logoplace.svg"
                      }
                      className="w-4 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl"
                    />
                  </div>
                </div>
                <h4 className=" font-medium">
                  {message?.card?.data?.vendor} Card
                </h4>
              </div>
              <div className="border-t border-pink-700/10 dark:border-neutral-700">
                <dl className="divide-y divide-pink-700/10 dark:divide-neutral-700">
                  <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                    <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                      Subcategory
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                      {message?.card?.data?.subcategory.value.replace(
                        `${message?.card?.data?.vendor}`,
                        ""
                      ) || "Please wait..."}
                    </dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                    <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                      Price
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                      {message?.card?.data?.price || "Please wait..."}
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          </CardComponent>
        )}

        {message.card.title === "e-Code" && (
          <CardComponent
            title={"E-code"}
            key={idx}
            footer={
              <>
                <Button onClick={() => setOpenEcode(true)}>Edit</Button>
                <ECodeComp
                  scrollToBottom={scrollToBottom}
                  chatId={chatId}
                  idx={idx}
                  edit={true}
                  openEcode={openEcode}
                  setOpenEcode={setOpenEcode}
                />
              </>
            }
          >
            <div className="flex align-middle justify-center place-items-center">
              <div
                className={`${
                  !hideCode ? "text-[1.1em]" : " dark:text-neutral-600"
                } select-none py-1.5 px-2.5 rounded-lgst duration-50 bg-neutral-100 dark:bg-black`}
              >
                {!hideCode
                  ? message.card.data?.value.replace(/(.{4})/g, "$1 ")
                  : "●●●● ●●●● ●●●● ●●●●"}
              </div>
              <button
                onClick={() => setHideCode((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 duration-300"
              >
                {hideCode ? (
                  <EyeClosedIcon width={18} />
                ) : (
                  <EyeIcon width={18} />
                )}
              </button>
            </div>
          </CardComponent>
        )}

        {message.card.title === "rate" && (
          <CardComponent title="Card Rate">
            <div className="select-none text-lg font-medium">
              ₦{formatCurrency(message.card.data?.value)}
            </div>
            <div className="select-none text-neutral-600 dark:text-neutral-300 text-base">
              for {card?.price ? formatCurrency(card?.price.toString()) : "--"}
            </div>
          </CardComponent>
        )}

        {message.card.title === "start_transaction" && (
          <CardComponent
            footer={
              <>
                {message.card.data.status !== "rejected_by_user" &&
                message.card.data.status !== "accepted_by_user" ? (
                  <Button
                    className="mt-2"
                    disabled={data.transaction.accepted}
                    onClick={() => setOpenConfirmTransaction(true)}
                  >
                    {data.transaction.accepted ? "Confirmed" : "Confirm"}
                  </Button>
                ) : (
                  <p></p>
                )}
              </>
            }
            title={
              message.card.data.status === "rejected_by_user"
                ? "Rejected"
                : message.card.data.status === "accepted_by_user"
                ? "Accepted"
                : "Confirm"
            }
            desc={
              message.card.data.status === "rejected_by_user" ? (
                <p>❌ You rejected this transaction</p>
              ) : message.card.data.status === "accepted_by_user" ? (
                <p>✔️ Transaction is Confirmed.</p>
              ) : (
                <p>Please confirm details to complete the transaction</p>
              )
            }
            color={
              message.card.data.status === "rejected_by_user"
                ? "red"
                : message.card.data.status === "accepted_by_user"
                ? "green"
                : undefined
            }
          />
        )}

        {message.read_receipt.delivery_status === "not_sent" && (
          <div className="absoulte right-2 bottom-1 p-2">
            <ClockIcon width={12} />
          </div>
        )}
      </div>

      <ConfirmTransaction
        chatId={chatId}
        openConfirmTransaction={openConfirmTransaction}
        setOpenConfirmTransaction={setOpenConfirmTransaction}
        edit={data?.transaction?.cardDetails?.ecode ? true : false}
        data={data}
      />
    </>
  );
};

export default CardMessage;
