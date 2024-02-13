"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/utils/firebase";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { ReportData } from "../../../../../../types";
import {
  ChatBubbleLeftIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

const iconMap = {
  report: <DocumentIcon width={20} />,
  transactional: <CurrencyDollarIcon width={20} />,
  feedback: <ChatBubbleLeftIcon width={20} />,
  chat: <ChatBubbleLeftIcon width={20} />,
};

const AdminReports = (props: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<ReportData[]>();

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const ref = collection(db, "Reports");
      const q = query(ref);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No reports found");
        setLoading(false);
        return;
      } else {
        const data = querySnapshot.docs.map((doc) => {
          return {
            ...(doc.data() as ReportData),
            link: doc.id,
          };
        });
        setReports(data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching reports", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderReports = () => {
    const filteredReports = reports?.filter(
      (report) => tab === "all" || report.type === tab
    );

    return filteredReports && filteredReports.length > 0 ? (
      filteredReports.map((report, idx) => {
        return (
          <Link
            href={`/admin/reports/${report.link}`}
            key={idx}
            className="flex gap-4 align-middle place-items-center justify-between py-3 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-100 ease-in cursor-pointer h-fit max-w-lg w-full mx-auto"
            onClick={async () => {
              const reportRef = doc(db, "Reports", report?.link);
              const reportData = {
                read: true,
              };
              // Update the last message
              await updateDoc(reportRef, reportData);
            }}
          >
            <div className="p-1 bg-primary rounded-full">
              <Image
                className="self-center"
                src={"/logoplace.svg"}
                width={28}
                height={28}
                alt="vendor"
              />
            </div>
            <div className="place-self-start w-full">
              <h4
                className={`${report.read ? "" : "font-bold text-secondary"}`}
              >
                {report.details.subject}
              </h4>
              <p className="text-[12px] w-[180px] max-w-[250px] truncate font-light text-neutral-400">
                {report.details.body}
              </p>
            </div>
            {report?.cause === "transactional"
              ? iconMap.transactional
              : report?.cause === "feedback"
              ? iconMap.feedback
              : report?.cause === "chat"
              ? iconMap.chat
              : iconMap.report}
          </Link>
        );
      })
    ) : (
      <p className="p-16 text-center font-semibold capitalize text-neutral-400">
        No reports to display
      </p>
    );
  };

  return (
    <div className="duration-300">
      <nav className="container my-2 px-4 flex align-middle justify-between place-items-center">
        <div className="flex align-middle justify-between place-items-center"></div>
        <DropdownMenu>
          {tab !== "all" ? (
            <Button
              className="flex align-middle place-items-center font-light text-xs text-neutral-00 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 group bg-neutral-200 dark:bg-neutral-800 capitalize gap-2 border dark:border-neutral-700"
              variant={"ghost"}
              onClick={() => setTab("all")}
            >
              {tab ? "Approved" : "Not approved"}
              <XMarkIcon
                className="group-hover:bg-neutral-400 p-1 rounded-full duration-150"
                width={20}
              />
            </Button>
          ) : (
            <DropdownMenuTrigger
              className={`flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 border ${
                tab !== "all" ? "bg-neutral-200 dark:bg-neutral-800" : ""
              }  focus-visible:outline-none group duration-150`}
            >
              <Button
                className="p-0 h-fit hover:bg-transparent capitalize gap-2 flex"
                variant={"ghost"}
              >
                {tab ? "Approved" : "Not approved"} <CaretSortIcon width={22} />
              </Button>
            </DropdownMenuTrigger>
          )}
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
                setTab("report");
              }}
            >
              Report
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setTab("feedback");
              }}
            >
              Feedback
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="">
        <div className="grid grid-flow-row  rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700">
          {renderReports() as ReactNode}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
