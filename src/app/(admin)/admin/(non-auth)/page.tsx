"use client";

import SuccessCheckmark from "@/components/successMark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  StarIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

type Props = {};

export const photoUrls = [
  "https://plus.unsplash.com/premium_photo-1696587025055-edee8ff58916?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE2fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1691145445988-563240a2bb82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIwfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1697215786004-682b1684c65e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1699724684258-448f4b9baa38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1700668497390-43014cf7a3b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1666968881524-226746362f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUzfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1621246475596-153d9c743fa4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
];

const navBoxes = [
  {
    name: "Messages",
    icon: <ChatBubbleBottomCenterTextIcon width={24} color="white" />,
    desc: "View all conversations",
    color: "blue",
    link: "/admin/chat",
  },
  {
    name: "Transactions",
    icon: <CurrencyDollarIcon width={24} color="white" />,
    desc: "Your transactions",
    color: "green",
    link: "/admin/transactions",
  },
  {
    name: "Users",
    icon: <UserIcon width={24} color="white" />,
    desc: "Manage users",
    color: "purple",
    link: "/admin/users",
  },
  {
    name: "Reports",
    icon: <InformationCircleIcon width={24} color="white" />,
    desc: "View reported issues",
    color: "orange",
    link: "/admin/reports",
  },
];

const AdminPage = function (props: Props) {
  const [chatList, setChatList] = useState<Array<ChatObject>>([]);
  const [reviewState, setReviewState] = useState({
    loading: false,
    sent: false,
  });
  const [review, setReview] = useState({
    username: "",
    review: "",
    stars: 0,
  });
  const router = useRouter();
  const unreadMessagesNumber = chatList?.filter(
    (chat) => !chat?.data?.lastMessage?.read
  ).length;

  const playSound = () => {};
  playSound();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (auth.currentUser) {
          const q = query(collection(db, "Messages"));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatData = querySnapshot.docs.map((doc) => {
              if (doc.exists()) {
                return { id: doc.id, data: doc.data() };
              } else {
                console.log("document does not exist");
              }
            });

            const sortedChats = chatData.sort((a, b) => {
              const timeA =
                a?.data?.lastMessage?.timeStamp?.seconds * 1000 +
                a?.data?.lastMessage?.timeStamp?.nanoseconds / 1e6;

              const timeB =
                b?.data?.lastMessage?.timeStamp?.seconds * 1000 +
                b?.data?.lastMessage?.timeStamp?.nanoseconds / 1e6;
              return timeB - timeA;
            });

            // Limit the result to 5 objects
            const limitedChats = sortedChats.slice(0, 3);

            setChatList(limitedChats as Array<ChatObject>);
          });

          return () => unsubscribe(); // Cleanup the subscription when the component unmounts
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  const stars = [1, 2, 3, 4, 5];

  const submitReview = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setReviewState((prev) => {
      return {
        ...prev,
        loading: true,
      };
    });

    try {
      const reviewRef = collection(db, "Feedbacks");
      const reviewData = {
        approved: true,
        user: {
          username: review.username,
          photoUrl: photoUrls[Math.floor(Math.random() * photoUrls.length)],
        },
        content: {
          stars: review.stars,
          review: review.review,
        },
        date: new Date(),
      };
      await addDoc(reviewRef, reviewData);

      setReviewState((prev) => {
        return {
          ...prev,
          loading: false,
          sent: true,
        };
      });
    } catch (error) {
      console.log("Error submitting review", error);
      setReviewState((prev) => {
        return {
          ...prev,
          loading: false,
          sent: false,
        };
      });
    }
  };

  const renderChats = chatList?.map((chat, idx) => {
    return (
      <div
        key={idx}
        className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-md min-w-fit hover:px-0.5"
      >
        <Link
          href={`/admin/chat/${chat?.id}`}
          className="flex align-middle place-items-center justify-between gap-3 dark:bg-opacity-10 dark:active:bg-neutral-700 px-2 py-3 duration-300 dark:text-white w-full h-fit"
          onClick={async () => {
            const chatRef = doc(db, "Messages", chat?.id);
            const chatData = {
              lastMessage: {
                ...chat?.data?.lastMessage,
                read: true,
              },
            };
            // Update the last message
            await updateDoc(chatRef, chatData);
          }}
        >
          <div className="p-5 bg-gradient-to-tr rounded-full from-zinc-300  to-stone-500 active:to-zinc-300 active:from-stone-500 shadow-primary"></div>
          <div className="w-full">
            <h4
              className={`${
                chat?.data?.lastMessage?.read ? "" : "font-bold text-secondary"
              } truncate max-w-[13rem]`}
            >
              {chat?.data?.lastMessage?.text}
            </h4>
            <div className="flex align-middle place-items-center justify-between pt-1.5">
              <p className="text-xs text-neutral-400 font-medium capitalize">
                {chat?.data?.lastMessage?.sender || "User"}
              </p>
              <p className="text-[10px] text-secondary">
                {formatTime(
                  new Date(
                    (chat?.data?.lastMessage?.timeStamp?.seconds ?? 0) * 1000 +
                      (chat?.data?.lastMessage?.timeStamp?.nanoseconds ?? 0) /
                        1e6
                  ).toISOString()
                )}
              </p>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div className="container pb-4">
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {navBoxes.map((box, idx) => {
          return (
            <Link
              href={box.link}
              key={idx}
              className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg shadow-purple-100 dark:shadow-purple-950/10 py-6 hover:border-purple-200 dark:hover:border-purple-600/30 hover:shadow-inner border-2 border-transparent duration-300"
            >
              <div className="grid align-middle place-items-center justify-center">
                <div
                  className={`flex align-middle place-items-center ${
                    box.name === "Messages"
                      ? "bg-blue-400 shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-600/40"
                      : box.name === "Reports"
                      ? "bg-orange-400 shadow-orange-200 dark:bg-orange-500 dark:shadow-orange-600/40"
                      : box.name === "Transactions"
                      ? "bg-green-400 shadow-green-200 dark:bg-green-500 dark:shadow-green-600/40"
                      : box.name === "Users"
                      ? "bg-purple-400 shadow-purple-200 dark:bg-purple-500 dark:shadow-purple-600/40"
                      : "bg-yellow-400 shadow-yellow-200 dark:bg-yellow-500 dark:shadow-yellow-600/40"
                  }  p-3.5 shadow-md rounded-xl relative`}
                >
                  {box.icon}
                  {box.name === "Messages" && unreadMessagesNumber > 0 && (
                    <div className="absolute -top-1 -right-1  bg-red-500 rounded-full h-4 w-4 text-[10px] grid align-middle place-items-center text-center font-bold text-white">
                      <h4>{unreadMessagesNumber}</h4>
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-neutral-800 dark:text-white mt-2">
                  {box.name}
                </h4>
              </div>
              <h6 className="text-neutral-300 dark:text-neutral-600 w-2/3 font-medium text-xs text-center mx-auto mt-3">
                {box.desc}
              </h6>
            </Link>
          );
        })}
      </div>
      <div className="my-8 bg-white dark:bg-neutral-800 px-4 pb-2 rounded-2xl z-40">
        <div className="dark:text-neutral-400 border-b my-1 dark:border-b-neutral-700 flex align-middle place-items-center justify-between py-3">
          <h4 className="font-semibold text-neutral-500">Latest</h4>
          <Link
            href={"/admin/chat"}
            className="p-2 rounded-md bg-neutral-700 text-[12px] text-secondary font-bold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800">
          {renderChats.length !== 0 ? (
            renderChats
          ) : (
            <div>
              <h4 className="dark:text-neutral-500 grid place-items-center p-16">
                No messages yet
              </h4>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-800 mb-6 rounded-lg p-8">
        <div className="">
          <p className="text-xs mb-3">Have a review from a customer?</p>
          <Dialog>
            <DialogTrigger className="bg-primary px-6 py-2 w-full rounded-xl text-white font-semibold">
              Post review
            </DialogTrigger>
            <DialogContent className="z-[99999999] w-[96vw] rounded-xl">
              {reviewState.sent ? (
                <>
                  <DialogHeader className="text-center">
                    <h4 className="text-lg font-semibold w-fit mx-auto">
                      Sent
                    </h4>
                  </DialogHeader>
                  <div>
                    <SuccessCheckmark />
                  </div>
                  <DialogClose
                    className="bg-primary py-2 w-2/4 px-6 mx-auto rounded-lg text-white"
                    onClick={() => {
                      setReview({
                        username: "",
                        review: "",
                        stars: 0,
                      });
                      setReviewState((prev) => {
                        return {
                          ...prev,
                          loading: false,
                          sent: false,
                        };
                      });
                    }}
                  >
                    Okay Close
                  </DialogClose>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <h4 className="text-lg font-semibold">Add a review</h4>
                  </DialogHeader>
                  <DialogDescription className="text-xs leading-6 text-center px-8 text-neutral-400">
                    Add a customer review or feedback. this will show up on the
                    landing page testimonials section
                  </DialogDescription>
                  <form
                    onSubmit={(e) => submitReview(e)}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <Label className="text-neutral-600 mb-2" htmlFor="name">
                        Customer&apos;s name
                      </Label>
                      <Input
                        onChange={(e) => {
                          setReview((prev) => {
                            return {
                              ...prev,
                              username: e.target.value,
                            };
                          });
                        }}
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Customer's name"
                      />
                    </div>

                    <div>
                      <Label className="text-neutral-600 mb-2" htmlFor="review">
                        Customer&apos;s review
                      </Label>
                      <textarea
                        onChange={(e) => {
                          setReview((prev) => {
                            return {
                              ...prev,
                              review: e.target.value,
                            };
                          });
                        }}
                        id="review"
                        name="review"
                        rows={5}
                        className="border rounded-lg w-full shadow-sm p-3"
                        placeholder="Customer's review"
                      />
                    </div>

                    <div className="flex align-middle justify-center gap-2">
                      {stars.map((_, idx) => {
                        return (
                          <StarIcon
                            key={idx}
                            width={45}
                            className={`${
                              idx + 1 <= review.stars
                                ? "text-yellow-400 scale-[1.2]"
                                : "text-neutral-400 hover:scale-[1.2]"
                            } cursor-pointer hover:text-yellow-400 transition-all duration-300`}
                            onClick={() => {
                              setReview((prev) => {
                                return {
                                  ...prev,
                                  stars: idx + 1,
                                };
                              });
                              console.log(review);
                            }}
                          />
                        );
                      })}
                    </div>
                    <Button>Submit</Button>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>{" "}
      <Link
        href={"/admin/reports/reviews"}
        className="text-xs text-center border w-full mx-auto bg-neutral-700 my-16 p-3 rounded-lg font-semibold"
      >
        Manage Reviews
      </Link>
    </div>
  );
};

export default AdminPage;
