"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/utils/firebase";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

type Props = {};

const AdminReviews = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewData[]>();

  console.log("review", review);

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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReview();
  }, []);

  const renderReview = () => {
    if (review?.length > 0) {
      return review?.map((review, idx) => {
        return (
          <Card
            key={idx}
            className={`grid place-items-center justify-center align-middle p-4 hover:px-5.5 duration-100 ease-in cursor-pointer h-fit border-0`}
          >
            <CardContent>
              <div className={`col-span-5 place-self-start`}>
                <h4 className="text-base font-medium first-letter:capitalize">
                  {review.user.username}
                </h4>

                <p className="text-[12px] py-2 w-full leading-6 font-light text-neutral-400 ">
                  {review.content.review}
                </p>
              </div>
              <div className="flex align-middle justify-start gap-1 mb-6">
                {Array.from({ length: review.content.stars }).map((_, idx) => {
                  return (
                    <StarIcon
                      key={idx}
                      width={16}
                      className={`${
                        idx + 1 <= 5
                          ? "text-yellow-400 scale-[1.2]"
                          : "text-neutral-400 hover:scale-[1.2]"
                      } cursor-pointer hover:text-yellow-400 transition-all duration-300`}
                    />
                  );
                })}
              </div>
              {review.approved ? (
                <Button
                  onClick={async () => {
                    const reviewRef = doc(db, "Feedbacks", review?.link);
                    const reviewData = {
                      approved: false,
                    };
                    // Update the last message
                    await updateDoc(reviewRef, reviewData);
                    router.refresh();
                  }}
                  className="bg-green-800 bg-opacity-30 border border-green-700 flex gap-2"
                  variant={"ghost"}
                >
                  Approved <CheckIcon width={12} className="text-green-400" />
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    const reviewRef = doc(db, "Feedbacks", review?.link);
                    const reviewData = {
                      approved: true,
                    };
                    // Update the last message
                    await updateDoc(reviewRef, reviewData);
                    router.refresh();
                  }}
                  className="bg-green-500 border border-green-700"
                  variant={"ghost"}
                >
                  Approve this
                </Button>
              )}
            </CardContent>
          </Card>
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
      <nav className="md:h-[24vh] container px-4 py-3 flex align-middle justify-between place-items-center">
        <div className="flex align-middle justify-between place-items-center">
          <Button
            variant={"ghost"}
            className="border px-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon width={22} />
          </Button>
        </div>
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
