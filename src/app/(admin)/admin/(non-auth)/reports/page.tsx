"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/utils/firebase";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

type Props = {};

const AdminReports = (props: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState("report");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<ReportData[]>();
  const [filteredType, setFilteredType] = useState("all");

  console.log("reports", reports);

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
        console.log(data);
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
  }, []);

  const renderReports = () => {
    const filteredReports = reports?.filter(
      (report) => tab === "all" || report.type === tab
    );

    return filteredReports && filteredReports.length > 0 ? (
      filteredReports.map((report, idx) => {
        return (
          <Link
            href={{
              pathname: `transactions/${report.link}`,
              query: { _id: report.link },
            }}
            as={`reports/${report.link}`}
            key={idx}
            className={`flex justify-between align-middle p-4 hover:px-5.5 duration-100 ease-in cursor-pointer h-fit place-items-center`}
            onClick={async () => {
              const reportRef = doc(db, "Reports", report?.link);
              const reportData = {
                read: true,
              };
              // Update the last message
              await updateDoc(reportRef, reportData);
            }}
          >
            <div
              className={`${
                report.read ? "" : "font-bold text-secondary"
              } col-span-5 place-self-start`}
            >
              <h4 className="text-base font-medium first-letter:capitalize">
                {report.details.subject}
              </h4>
              <p className="text-[12px] w-60 font-light text-neutral-400 truncate">
                {report.details.body}
              </p>
            </div>
            <div className="text-[12px] capitalize">{report.cause}</div>
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
    <div className="duration-300 overflow-hidden">
      <nav className="md:h-[24vh] container px-4 py-3 flex align-middle justify-between place-items-center">
        <div className="flex align-middle justify-between place-items-center">
          <Button
            variant={"ghost"}
            className="border px-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon width={22} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex align-middle place-items-center font-light capitalize px-3 rounded-lg py-2 focus-visible:outline-none text-neutral-500">
              <span className="ml-1">{tab}</span> <ChevronDownIcon width={22} />
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
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger className="flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 capitalize focus-visible:outline-none">
            {filteredType} <CaretSortIcon color="#222" width={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setFilteredType("all");
              }}
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4 capitalize"
              onClick={() => {
                setFilteredType("transaction");
              }}
            >
              transaction
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4 capitalize"
              onClick={() => {
                setFilteredType("feedback");
              }}
            >
              feedback
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4 capitalize"
              onClick={() => {
                setFilteredType("technical");
              }}
            >
              technical
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4 capitalize"
              onClick={() => {
                setFilteredType("chat");
              }}
            >
              chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </nav>

      <div className="container">
        <div className="grid grid-flow-row bg-white rounded-lg divide-y divide-neutral-200">
          {renderReports() as ReactNode}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
