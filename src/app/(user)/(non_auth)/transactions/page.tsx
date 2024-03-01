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
//       <div className="bg-white dark:bg-neutral-800 flex-col divide-y divide-neutral-200 dark:divide-neutral-700v pb-4 max-w-md mx-auto">
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

import ChatCard from "@/components/admin/chat/ChatCard";
import TransactionCard from "@/components/admin/transactions/TransactionCard";
import { getUserTransactions } from "@/lib/utils/getUserTransactions";
import Link from "next/link";
import React from "react";

type Props = {};

const UserTransactionsPage = async (props: Props) => {
  const transaction = await getUserTransactions();

  if (!transaction || !transaction.success || !transaction.data) {
    return (
      <section className="bg-white dark:bg-neutral-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
              Whoops!
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">
              Transaction data could not be fetched.
            </p>
            <p className="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">
              Please try again.
            </p>
          </div>
          <Link className=" mx-auto" href={"/chat"}>
            Retry
          </Link>
        </div>
      </section>
    );
  }

  const renderTransaction = transaction.data.map((transaction, idx) => {
    return <TransactionCard transaction={transaction} idx={idx} key={idx} />;
  });

  return <div className="">{renderTransaction}</div>;
};

export default UserTransactionsPage;
