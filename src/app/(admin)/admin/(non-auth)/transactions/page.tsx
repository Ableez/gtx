"use client";
import Loading from "@/app/loading";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { TransactionRec } from "../../../../../../chat";
import TransactionCard from "@/components/admin/transactions/TransactionCard";
import { db } from "@/lib/utils/firebase";
import TransactionsNav from "@/components/admin/transactions/TransactionsNav";

type Props = {};

const AdminTransactions = (props: Props) => {
  const [transactions, setTransactions] = useState<TransactionRec[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
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
            ...doc.data(),
            id: doc.id,
          } as TransactionRec;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTransactions = () => {
    const filteredTransactions = transactions.filter(
      (transaction) =>
        filteredStatus === "all" || transaction.data.status === filteredStatus
    );

    return filteredTransactions.map((transaction, idx) => {
      return <TransactionCard key={idx} transaction={transaction} idx={idx} />;
    });
  };

  // ADMIN

  return (
    <div className="duration-300">
      <TransactionsNav
        filteredStatus={filteredStatus}
        setFilteredStatus={setFilteredStatus}
      />
      <div className="bg-white dark:bg-neutral-900 flex-col divide-y divide-neutral-100 pb-4">
        {loading ? (
          <Loading />
        ) : (
          <>
            {transactions.length > 0 && renderTransactions().length > 0 ? (
              <div className="grid divide-y dark:divide-neutral-700 divide-neutral-200">
                {renderTransactions()}
              </div>
            ) : (
              <div className="text-neutral-400 font-medium text-center py-16">
                <h1 className="text-[100px] font-black text-neutral-300 font-serif">
                  !!!
                </h1>
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
