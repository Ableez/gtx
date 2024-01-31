import Link from "next/link";
import React from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type Props = {
  chatList: ChatObject;
};

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

const NavCards = ({ chatList }: Props) => {
  const unreadMessagesNumber = chatList?.filter(
    (chat) => !chat?.data?.lastMessage?.read
  ).length;

  return (
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
  );
};

export default NavCards;
