import ChatCard from "@/components/admin/chat/ChatCard";
import { getUserChats } from "@/lib/utils/getUserChats";
import Cookies from "js-cookie";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const user = Cookies.get("user");

const UserChats = async (props: Props) => {
  const chats = await getUserChats();

  if (!user) {
    return redirect("/sell");
  }

  if (!chats || !chats.success || !chats.data) {
    return (
      <section className="bg-white dark:bg-neutral-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
              Whoops!
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">
              Chats data could not be fetched.
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

  const renderChats = chats.data.map((chat, idx) => {
    return <ChatCard chat={chat} key={idx} />;
  });

  return <div className="">{renderChats}</div>;
};

export default UserChats;
