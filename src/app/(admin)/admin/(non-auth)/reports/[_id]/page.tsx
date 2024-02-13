"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/utils/firebase";
import { formatDate, formatTime } from "@/lib/utils/formatTime";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ReportData } from "../../../../../../../types";

type Props = {
  params: {
    _id: string;
  };
};

const AdminReportView = ({ params }: Props) => {
  const [loading, setLoading] = useState(false);
  const reportId = params._id;
  const [reportData, setReportData] = useState<ReportData>();
  const router = useRouter();

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "Reports", reportId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ReportData;
          setReportData(data);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportId]);

  console.log("REPORT_DATA", reportData);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {reportData ? (
            <>
              <div className="max-w-screen-md mx-auto space-y-6 my-10 px-4">
                <nav className="flex gap-2 align-middle place-items-center justify-between border-b dark:border-neutral-700 pb-2">
                  <h4 className="font-semibold text-base first-letter:capitalize py-1">
                    {reportData?.details.subject}
                  </h4>
                  <div className="capitalize p-1 text-xs bg-purple-200 dark:bg-purple-900  px-2 rounded-full">
                    {reportData?.cause}
                  </div>
                </nav>

                <div className="flex align-middle place-items-center gap-3">
                  <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
                  <div className="flex-col align-middle place-items-center justify-start">
                    <h4 className="font-semibold text-base capitalize">
                      {reportData?.user.username}
                    </h4>
                    <span className="text-[12px] text-neutral-400">
                      Recieved at{" "}
                      {formatDate(
                        new Date(
                          (reportData?.date?.seconds ?? 0) * 1000 +
                            (reportData?.date?.nanoseconds ?? 0) / 1e6
                        ).toISOString()
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-orange-100 dark:bg-orange-400 dark:bg-opacity-10 px-4 md:px-6 py-3 border border-orange-400 border-opacity-20 rounded-md text-xs leading-6 flex-wrap">
                  {reportData?.details?.body}
                </div>

                {reportData?.cause == "transactional" && (
                  <div>
                    <div className="grid space-y-3 mb-4">
                      <div className="flex align-middle place-items-center justify-between">
                        <div className="font-medium">Source</div>
                        <div className="capitalize p-1 text-xs bg-rose-200 dark:bg-rose-900  px-2 rounded-full">
                          {reportData?.type}
                        </div>
                      </div>

                      <Link
                        href={`/admin/transactions/${reportData?.data?.id}`}
                        className="border border-transparent hover:border-purple-400 flex align-middle place-items-center justify-between w-full dark: mx-auto p-4 border-purple-100 dark:border-opacity-40 hover:shadow-sm group text-purple-900"
                      >
                        <div className="flex align-middle place-items-center justify-between gap-4 dark:text-neutral-300">
                          <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-purple-400 bg-purple-100 dark:bg-purple-950 dark:bg-opacity-40 dark:border-purple-700 dark:text-purple-500">
                            <CurrencyDollarIcon width={22} />
                          </div>
                          View Transaction
                        </div>

                        <ChevronRightIcon
                          width={22}
                          className="group-hover:ml-2 duration-300 ease-in"
                        />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-neutral-400 font-semibold">
              No such document
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminReportView;
