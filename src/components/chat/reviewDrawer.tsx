"use client";
import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SuccessCheckmark from "../successMark";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import { reviewAction } from "@/lib/utils/reviewAction";
import { useFormStatus } from "react-dom";
import Cookies from "js-cookie";

type Props = {};

const reviewsTemp = [
  "E no bad, e no worse",
  "I juss manage am",
  "Issokay",
  "This na one correct!",
  "Love this! E choke die!",
];

const review_in = localStorage.getItem("review_in");

const ReviewDrawer = (props: Props) => {
  const { pending } = useFormStatus();
  const router = useRouter();
  const starsArr = [1, 2, 3, 4, 5];
  const [stars, setStars] = useState(0);
  const sendReview = reviewAction.bind(null, stars);
  const [error, setError] = useState("");

  const [sent, setSent] = useOptimistic(
    false,
    (state: boolean, outcome: boolean) => outcome
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const handleSubmit = async (e: FormData) => {
    // Wrap the optimistic state update in a startTransition
    try {
      const res = await sendReview(e);
      setSent(res.sent);
      let reviewNumber = Number(review_in) || 0;
      reviewNumber++;
      localStorage.setItem("review_in", JSON.stringify(reviewNumber));
      router.back();
      setError(res.error as string);
    } catch (error) {
      console.error("Error submitting review", error);
      setSent(false);
      setError("Failed to submit review");
    }
  };

  return (
    <Drawer>
      {review_in && Number(review_in) % 2 !== 0 ? (
        <Button
          size={"icon"}
          onClick={() => {
            const review_in = localStorage.getItem("review_in");
            if (review_in && Number(review_in) % 2 !== 0) {
              router.back();
            }
          }}
          variant={"ghost"}
        >
          <ArrowLeftIcon width={18} />
        </Button>
      ) : (
        <DrawerTrigger asChild>
          <Button variant={"ghost"}>
            <ArrowLeftIcon width={18} />
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent className="z-[9999] px-4 pb-4 max-w-md mx-auto">
        {sent ? (
          <>
            <DrawerHeader>Sent</DrawerHeader>
            <div>
              <SuccessCheckmark />
            </div>
            <DrawerClose
              className="bg-primary py-2 w-2/4 px-6 mx-auto rounded-lg text-white"
              onClick={() => {
                setStars(0);
                setSent(false);
                router.replace("/sell");
              }}
            >
              Okay Close
            </DrawerClose>
          </>
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold">Review</DrawerTitle>
              <DrawerDescription className="py-2 text-xs">
                How was your experience? (Optional)
              </DrawerDescription>
            </DrawerHeader>
            <form
              action={async (e: FormData) => {
                startTransition(() => {
                  setSent(true);
                });
                handleSubmit(e);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <textarea
                  id="review"
                  name="review"
                  rows={3}
                  className="border rounded-lg w-full shadow-sm p-3"
                  placeholder="Tell us..."
                />
              </div>

              <span className="text-[12px] text-neutral-400 italic text-center">
                {reviewsTemp[stars - 1]}
              </span>

              <div className="flex align-middle justify-center gap-2">
                {starsArr.map((_, idx) => {
                  return (
                    <StarIcon
                      key={idx}
                      width={45}
                      className={`${
                        idx + 1 <= stars
                          ? "text-yellow-400 scale-[1.2]"
                          : "text-neutral-400 hover:scale-[1.2]"
                      } cursor-pointer hover:text-yellow-400 transition-all duration-300`}
                      onClick={() => {
                        setStars(idx + 1);
                      }}
                    />
                  );
                })}
              </div>
              <p
                className={`text-[10px] overflow-clip leading-5 border-neutral-800 mt-2 animate-out font-medium text-red-500 text-center duration-150 ${
                  error
                    ? "opacity-100 h-5 leading-5"
                    : "opacity-100 h-0 leading-10"
                }`}
              >
                {error && error}
              </p>
              <Button type="submit" disabled={pending} aria-disabled={pending}>
                Submit
              </Button>
              <Button
                type="button"
                disabled={pending}
                aria-disabled={pending}
                onClick={() => {
                  let reviewNumber = Number(review_in) || 0;
                  reviewNumber++;
                  localStorage.setItem(
                    "review_in",
                    JSON.stringify(reviewNumber)
                  );
                  router.back();
                }}
                variant={"ghost"}
                className="-mt-2 text-neutral-400"
              >
                Not now
              </Button>
            </form>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ReviewDrawer;
