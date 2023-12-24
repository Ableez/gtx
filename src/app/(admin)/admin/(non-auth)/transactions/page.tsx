"use client";
import Loading from "@/app/loading";
import Loader from "@/components/Loader";
import SellNavbar from "@/components/sellPage/SellNavbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "@/lib/utils/firebase";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Props = {};

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
      className="grid grid-flow-col grid-cols-7 align-middle py-4 px-4 hover:px-5 hover:bg-neutral-50 dark:hover:bg-neutral-700 duration-100 ease-in cursor-pointer h-fit place-items-center"
    >
      {/* border-b border-neutral-100 */}
      <Image
        className="self-center dark:opacity-40"
        src={"/logoplace.svg"}
        width={35}
        height={35}
        alt="vendor"
      />
      <div className="col-span-5 place-self-start">
        <h4 className="">
          {transaction.vendor}
          {transaction.product === "giftcard" ? " Card" : ""}
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">
            {" "}
            - ${transaction.amount}
          </span>
        </h4>
        <p className="text-[12px] font-light text-neutral-400">
          USA Apple Store 300 - 499
        </p>
      </div>
      <div
        className={`w-fit grid gap-1 self-center text-center place-items-center ${
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
          }  text-[12px] uppercase font-bold`}
        >
          {transaction.status}
        </span>
      </div>
    </Link>
  );
};

const AdminTransactions = (props: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState("giftcard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
    const uid = JSON.parse(localStorage?.getItem("uid") as string);
    try {
      setLoading(true);
      const ref = collection(db, "Transactions");
      const q = query(ref);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No transactions found");
        setLoading(false);
        return;
      } else {
        const data = querySnapshot.docs.map((doc) => {
          return {
            ...(doc.data() as Transaction),
            link: doc.id,
          };
        });
        setTransactions(data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching transactions", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      <nav className="md:h-[24vh] container px-4 py-3 flex align-middle justify-between place-items-center">
        <div className="flex align-middle justify-between place-items-center">
          <Button
            variant={"ghost"}
            className="border px-2 dark:border-neutral-700"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon width={22} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex align-middle place-items-center font-light capitalize px-3 rounded-lg py-2 focus-visible:outline-none text-neutral-500 ">
              <span className="ml-1 text-neutral-400 font-semibold">{tab}</span>
              <ChevronDownIcon width={22} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="py-3 px-4"
                onClick={() => {
                  setTab("all");
                }}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-3 px-4"
                onClick={() => {
                  setTab("crypto");
                }}
              >
                Crypto
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-3 px-4"
                onClick={() => {
                  setTab("giftcard");
                }}
              >
                Gift card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 capitalize focus-visible:outline-none">
            {filteredStatus} <CaretSortIcon color="#222" width={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setFilteredStatus("all");
              }}
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setFilteredStatus("done");
              }}
            >
              Done
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setFilteredStatus("pending");
              }}
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setFilteredStatus("cancelled");
              }}
            >
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="bg-white dark:bg-neutral-800 flex-col divide-y divide-neutral-100 pb-4 h-[76vh] overflow-y-scroll">
        {loading ? (
          <Loading />
        ) : (
          <>
            {transactions.length > 0 ? (
              <div className="grid divide-y dark:divide-neutral-700 divide-neutral-200">
                {renderTransactions()}
              </div>
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

export default AdminTransactions;
