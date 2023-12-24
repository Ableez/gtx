"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
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
          console.log("Document data:", data);
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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {reportData ? (
            <>
              <div className="container grid gap-6 pb-8">
                <nav className="flex gap-2 align-middle place-items-center justify-between">
                  <Button
                    onClick={() => router.back()}
                    variant={"ghost"}
                    className="shadow-none border w-fit"
                  >
                    <ArrowLeftIcon width={20} color="#222" />
                  </Button>
                  <div className="capitalize p-1 text-xs bg-purple-200 px-2 rounded-full">
                    {reportData?.type}
                  </div>
                </nav>
                <div>
                  <h4 className="font-bold text-lg first-letter:capitalize py-1">
                    {reportData?.details.subject}
                  </h4>
                </div>
                <div className="flex align-middle place-items-center gap-3">
                  <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
                  <div className="flex-col align-middle place-items-center justify-start">
                    <h4 className="font-semibold text-base capitalize">
                      {reportData?.user.username}
                    </h4>
                    <span className="text-[12px] text-neutral-400">
                      Sent in{" "}
                      {formatTime(
                        new Date(
                          (reportData?.date?.seconds ?? 0) * 1000 +
                            (reportData?.date?.nanoseconds ?? 0) / 1e6
                        ).toISOString()
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="leading-6 text-neutral-600 p-3 bg-orange-200 text-xs rounded-sm border border-orange-800/30">
                    {reportData?.details?.body}
                  </p>
                </div>
                {reportData?.cause === "transaction" && (
                  <div>
                    <dl className="grid space-y-3">
                      <div className="flex align-middle place-items-center justify-between">
                        <dt className="font-medium">Source</dt>
                        <dd className="capitalize p-1 text-xs bg-purple-200 px-2 rounded-full">
                          {reportData?.cause}
                        </dd>
                      </div>

                      <Link
                        href={`/chat/${reportData?.data?.transactionId || ""}`}
                        className="flex align-middle place-items-center justify-between w-full p-4 bg-white border-y border-purple-100 hover:shadow-sm group text-purple-900 hover:px-5 duration-300"
                      >
                        <div className="flex align-middle place-items-center justify-between gap-4">
                          <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-purple-400 bg-purple-100">
                            <CurrencyDollarIcon width={22} />
                          </div>
                          View Transaction
                        </div>

                        <ChevronRightIcon
                          width={22}
                          className="group-hover:ml-2 duration-300 ease-in"
                        />
                      </Link>
                    </dl>
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
