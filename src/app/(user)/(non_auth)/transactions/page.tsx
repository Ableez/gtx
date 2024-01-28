"use client";
import Loading from "@/app/loading";
import SellNavbar from "@/components/sellPage/SellNavbar";

import { auth, db } from "@/lib/utils/firebase";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import TransactionNavbar from "@/components/Transactions/navbar";
import { rawTransactions } from "@/lib/data/transactions";
import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {};

const iconMap = {
  done: <CheckIcon width={16} />,
  pending: <XMarkIcon width={16} />,
  cancellled: <XMarkIcon width={16} />,
  rejected: <XMarkIcon width={16} />,
};

export type Transaction = {
  link: string;
  product: string;
  vendor: string;
  amount: number;
  status: string;
  isApproved: boolean;
  date: string;
};
const TransactionCard = (
  transaction: {
    link: string;
    product: string;
    vendor: string;
    amount: number;
    status: string;
    isApproved: boolean;
    date: string;
  },
  idx: any
) => {
  return (
    <Link
      href={{
        pathname: `transactions/${transaction.link}`,
        query: { _id: transaction.link },
      }}
      as={`transactions/${transaction.link}`}
      key={idx}
      className="flex align-middle place-items-center justify-between py-4 px-4 hover:bg-purple-100 dark:hover:bg-neutral-700 duration-200 ease-in cursor-pointer h-fit"
    >
      {/* border-b border-neutral-100 */}
      <div className="flex align-middle place-items-center gap-3">
        <Image
          className="dark:opacity-25"
          src={"/logoplace.svg"}
          width={30}
          height={30}
          alt="vendor"
        />
        <div className="gap-1 grid">
          <h4 className="">
            {transaction.vendor}
            {transaction.product === "giftcard" ? " Card" : ""}
            <span className="font-semibold text-neutral-500">
              {" "}
              - ${transaction.amount}
            </span>
          </h4>
          <p className="text-[12px] font-light text-neutral-400">
            USA Apple Store 300 - 499
          </p>
        </div>
      </div>

      <div
        title={transaction.status}
        className={`w-fit text-xs ${
          transaction.isApproved
            ? "text-green-600"
            : transaction.status === "done"
            ? "text-green-600"
            : transaction.status === "pending"
            ? "text-orange-400"
            : "text-red-600"
        }`}
      >
        <span
          className={`${
            transaction.isApproved
              ? "text-green-400"
              : transaction.status === "done"
              ? "text-green-400"
              : transaction.status === "pending"
              ? "text-orange-400"
              : "text-red-500"
          } uppercase font-bold`}
        >
          {transaction.status === "done" ? iconMap.done : iconMap.rejected}
        </span>
      </div>
    </Link>
  );
};

const Transactions = (props: Props) => {
  const [tab, setTab] = useState("giftcard");
  const [transactions, setTransactions] =
    useState<Transaction[]>(rawTransactions);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);

  // const fetchTransactions = useCallback(async () => {
  //   const uid = Cookies.get("uid");
  //   try {
  //     setLoading(true);
  //     const ref = collection(db, "Transactions");
  //     const q = query(ref, where("user.uid", "==", uid));
  //     const querySnapshot = await getDocs(ref);

  //     if (querySnapshot.empty) {
  //       console.log("No transactions found");
  //       setLoading(false);
  //       return;
  //     } else {
  //       const data = querySnapshot.docs.map((doc) => {
  //         return {
  //           ...(doc.data() as Transaction),
  //           link: doc.id,
  //         };
  //       });
  //       // setTransactions(data);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching transactions", error);
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  const renderTransactions = () => {
    const filteredTransactions = transactions.filter(
      (transaction) =>
        (filteredStatus === "all" || transaction.status === filteredStatus) &&
        (tab === "all" || transaction.product === tab)
    );

    return filteredTransactions.map((transaction, idx) => {
      return TransactionCard(transaction, idx);
    });
  };

  return (
    <div className="duration-300 overflow-hidden">
      <TransactionNavbar tab={tab} setTab={setTab} />
      <div className="bg-white dark:bg-neutral-800 flex-col divide-y divide-neutral-200 dark:divide-neutral-700 pb-4 max-w-md mx-auto">
        {loading ? (
          <Loading />
        ) : (
          <>
            {transactions.length > 0 ? (
              renderTransactions()
            ) : (
              <div className="text-neutral-400 font-medium text-center py-16">
                No transactions found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
