import React from "react";
import { TransactionRec } from "../../../../chat";
import Link from "next/link";
import Image from "next/image";

type Props = {
  transaction: TransactionRec;
  idx: number;
};

const TransactionCard = ({ idx, transaction }: Props) => {
  return (
    <Link
      href={`transactions/${transaction.id}`}
      key={idx}
      className="flex gap-4 align-middle place-items-center justify-between py-3 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-100 ease-in cursor-pointer h-fit max-w-lg w-full mx-auto"
    >
      <div className="p-2 bg-primary rounded-full">
        <Image
          className="self-center dark:opacity-40"
          src={"/logoplace.svg"}
          width={45}
          height={45}
          alt="vendor"
        />
      </div>

      <div className="place-self-start w-full">
        <h4 className="">
          {transaction.data.cardDetails.vendor}
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">
            - {transaction.data.cardDetails.price}
          </span>
        </h4>
        <p className="text-[12px] font-light text-neutral-400">
          {transaction.data.cardDetails.name}
        </p>
      </div>
      <div
        className={`w-fit grid gap-1 self-center text-center place-items-center ${
          transaction.data.completed
            ? "text-neutral-500"
            : transaction.data.status === "done"
            ? "text-green-600"
            : transaction.data.status === "pending"
            ? "text-orange-400"
            : transaction.data.status === "processing"
            ? "text-yellow-500"
            : "text-red-600"
        }`}
      >
        <span
          className={`${
            transaction.data.completed
              ? "text-neutral-500"
              : transaction.data.status === "done"
              ? "text-green-600"
              : transaction.data.status === "pending"
              ? "text-orange-400"
              : transaction.data.status === "processing"
              ? "text-yellow-500"
              : "text-red-600"
          }  text-[12px] uppercase font-bold text-right`}
        >
          {transaction.data.status}
        </span>
      </div>
    </Link>
  );
};

export default TransactionCard;
