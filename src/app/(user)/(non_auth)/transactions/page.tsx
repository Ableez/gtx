// "use client";
// import Loading from "@/app/loading";
// import { db } from "@/lib/utils/firebase";
// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
// import React, { useCallback, useEffect, useState } from "react";
// import TransactionNavbar from "@/components/Transactions/navbar";
// import { TransactionRec } from "../../../../../chat";
// import TransactionCard from "@/components/admin/transactions/TransactionCard";

// type Props = {};

// const Transactions = (props: Props) => {
//   const [transactions, setTransactions] = useState<TransactionRec[]>([]);
//   const [filteredStatus, setFilteredStatus] = useState("all");
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchTransactions = useCallback(async () => {
//     try {
//       setLoading(true);
//       const ref = collection(db, "Transactions");
//       const q = query(ref);
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         console.log("No transactions found");
//         setLoading(false);
//         return;
//       } else {
//         const data = querySnapshot.docs.map((doc) => {
//           return {
//             ...doc.data(),
//             id: doc.id,
//           } as TransactionRec;
//         });

//         setTransactions(data);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log("Error fetching transactions", error);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTransactions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const renderTransactions = () => {
//     const filteredTransactions = transactions.filter(
//       (transaction) =>
//         filteredStatus === "all" || transaction.data.status === filteredStatus
//     );

//     return filteredTransactions.map((transaction, idx) => {
//       return <TransactionCard key={idx} transaction={transaction} idx={idx} />;
//     });
//   };

//   //  USER
//   return (
//     <div className="duration-300 overflow-hidden">
//       <TransactionNavbar
//         filteredStatus={filteredStatus}
//         setFilteredStatus={setFilteredStatus}
//       />
//       <div className="bg-white dark:bg-black flex-col divide-y divide-neutral-200 dark:divide-neutral-700v pb-4 max-w-md mx-auto">
//         {loading ? (
//           <Loading />
//         ) : (
//           <>
//             {transactions.length > 0 ? (
//               renderTransactions()
//             ) : (
//               <div className="text-neutral-400 font-medium text-center py-16">
//                 No transactions found
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Transactions;

import TransactionCard from "@/components/admin/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { getUserTransactions } from "@/lib/utils/getUserTransactions";
import { TicketIcon } from "@heroicons/react/24/outline";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const UserTransactionsPage = async (props: Props) => {
  const transaction = await getUserTransactions();
  const user = cookies().get("user")?.value;

  if (!user) {
    return redirect("/sell");
  }

  if (!transaction || !transaction.success || !transaction.data) {
    return (
      <section className="bg-white dark:bg-black">
        <h4>Oops, something went wrong!</h4>
        <p>
          We&apos;re having trouble fetching your transactions at the moment.
          Please try refreshing the page or check back later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh Page
        </button>
      </section>
    );
  }

  if (transaction.data.length === 0) {
    return (
      <section className="flex flex-col gap-4 place-items-center max-w-sm mx-auto px-4">
        <h4 className="text-xl font-semibold pt-8">No Transactions Yet</h4>
        <TicketIcon
          width={70}
          className="text-neutral-300 dark:text-neutral-700 m-4"
        />
        <p className="p-4 bg-neutral-200 rounded-xl m-2 text-sm">
          You haven&apos;t made any transactions yet. Start exploring and make
          your first transaction!
        </p>
        <Link href={"/sell"} className="w-full">
          <Button className="w-full">Sell a card</Button>
        </Link>
      </section>
    );
  }

  const renderTransaction = transaction.data.map((transaction, idx) => {
    return <TransactionCard transaction={transaction} idx={idx} key={idx} />;
  });

  return <div className="">{renderTransaction}</div>;
};

export default UserTransactionsPage;
