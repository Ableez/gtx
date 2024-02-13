"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/utils/firebase";
import { StarIcon } from "@heroicons/react/20/solid";
import { CheckIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { ReviewData } from "../../../../../../../types";
import { formatDateOnly } from "@/lib/utils/formatTime";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";

type Props = {};

const AdminReviews = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewData[]>([]);
  const [tab, setTab] = useState("all");

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      const ref = collection(db, "Feedbacks");
      const q = query(ref);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No review found");
        setLoading(false);
        return;
      } else {
        const data = querySnapshot.docs.map((doc) => {
          return {
            ...(doc.data() as ReviewData),
            link: doc.id,
          };
        });
        setReview(data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching review", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const renderReview = () => {
    const filteredReviews = review?.filter((rev) =>
      tab === "all" || rev.approved ? true : false
    );

    if (review?.length > 0) {
      return filteredReviews?.map((review, idx) => {
        return (
          <div key={idx} className=" space-y-2 py-3 border-b box-border">
            <div className="flex align-middle place-items-center justify-between">
              <div className="flex align-middle justify-start gap-1">
                {Array.from({ length: review.content.stars }).map((_, idx) => {
                  return (
                    <StarIcon
                      key={idx}
                      width={14}
                      className={`${
                        idx + 1 <= 5
                          ? "text-yellow-400 scale-[1.2]"
                          : "text-neutral-400 hover:scale-[1.2]"
                      }  hover:text-yellow-400 transition-all duration-300`}
                    />
                  );
                })}
                {Array.from({ length: 5 - review.content.stars }).map(
                  (_, idx) => {
                    return (
                      <StarIcon
                        key={idx}
                        width={12}
                        className={`${
                          idx + 1 <= 5
                            ? "text-neutral-500 scale-[1.2]"
                            : "text-neutral-500 hover:scale-[1.2]"
                        }  hover:text-neutral-500 transition-all duration-300`}
                      />
                    );
                  }
                )}
              </div>
              <h6 className="text-xs text-opacity-70">
                {formatDateOnly(
                  new Date(
                    (review?.date?.seconds ?? 0) * 1000 +
                      (review?.date?.nanoseconds ?? 0) / 1e6
                  ).toISOString()
                )}
              </h6>
            </div>

            <h4 className="text-base font-semibold first-letter:capitalize">
              {review.user.username}
            </h4>
            <p className="text-xs leading-5">{review.content.review}</p>

            <div className="flex align-middle justify-between gap-2 w-full">
              {review.user.id ? (
                <div className="flex align-middle place-items-center justify-start gap-1.5">
                  <CheckBadgeIcon width={18} className="text-green-500" />
                  <h6 className="uppercase text-[10px] font-semibold tracking-wide">
                    Verified User
                  </h6>
                </div>
              ) : (
                <div className="flex align-middle place-items-center justify-start gap-1.5">
                  <StarIcon width={14} className="text-neutral-500" />
                  <h6 className="uppercase text-[10px] font-semibold tracking-wide">
                    Loyal Customer
                  </h6>
                </div>
              )}
              <div className="justify-self-end place-self-end">
                {loading ? (
                  <Button
                    disabled={true}
                    aria-disabled="true"
                    title="Please wait..."
                    variant={"ghost"}
                    className="border-neutral-300"
                  >
                    <SunIcon width={18} className="animate-spin" />
                  </Button>
                ) : review.approved ? (
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      const reviewRef = doc(
                        db,
                        "Feedbacks",
                        review?.link as string
                      );
                      const reviewData = {
                        approved: false,
                      };
                      await updateDoc(reviewRef, reviewData);
                      router.refresh();
                      setLoading(false);
                    }}
                    title="Cancel this review"
                    className="bg-red-500 bg-opacity-10 border border-red-700 border-opacity-40 flex gap-2"
                  >
                    <XMarkIcon
                      width={16}
                      strokeWidth={2}
                      className="text-red-500"
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      const reviewRef = doc(
                        db,
                        "Feedbacks",
                        review?.link as string
                      );
                      const reviewData = {
                        approved: true,
                      };
                      await updateDoc(reviewRef, reviewData);
                      router.refresh();
                      setLoading(false);
                    }}
                    title="Approve this review"
                    className="bg-green-500 border border-green-700"
                  >
                    <CheckIcon width={16} strokeWidth={2} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="grid place-items-center align-middle p-16">
          <Loader />
        </div>
      );
    }
  };

  return (
    <div className="duration-300 overflow-hidden">
      <nav className="container my-2 px-4 flex align-middle justify-between place-items-center">
        <div className="flex align-middle justify-between place-items-center"></div>
        <DropdownMenu>
          {!tab ? (
            <Button
              className="flex align-middle place-items-center font-light text-xs text-neutral-00 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 group bg-neutral-200 dark:bg-neutral-800 capitalize gap-2 border dark:border-neutral-700"
              variant={"ghost"}
              onClick={() => setTab("all")}
            >
              {tab ? "Approved" : "All"}
              <XMarkIcon
                className="group-hover:bg-neutral-400 p-1 rounded-full duration-150"
                width={20}
              />
            </Button>
          ) : (
            <DropdownMenuTrigger
              className={`flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 border ${
                !tab ? "bg-neutral-200 dark:bg-neutral-800" : ""
              }  focus-visible:outline-none group duration-150`}
            >
              <Button
                className="p-0 h-fit hover:bg-transparent capitalize gap-2 flex"
                variant={"ghost"}
              >
                {tab} <CaretSortIcon width={22} />
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
                setTab("approved");
              }}
            >
              Approved
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-3 px-4"
              onClick={() => {
                setTab("not_approved");
              }}
            >
              Not Approved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <div className="container">
        <div className="grid grid-flow-row bg-white dark:bg-transparent rounded-lg divide-neutral-200 dark:divide-neutral-600 gap-4">
          {renderReview() as ReactNode}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
