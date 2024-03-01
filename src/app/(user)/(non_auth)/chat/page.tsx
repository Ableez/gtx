import { getUserChats } from "@/lib/utils/getUserChats";
import Link from "next/link";
import React from "react";

type Props = {};

const UserChats = async (props: Props) => {
  const users = await getUserChats();

  if (!users.success) {
    return (
      <section className="bg-white dark:bg-neutral-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              Whoops!
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">
              Chats data could not be fetched.
            </p>
            <p className="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">
              Please try again.
            </p>
          </div>
          <Link href={"/chat"}>Retry</Link>
        </div>
      </section>
    );
  }

  const renderChats = users?.data?.map((chat) => {
    return (
      <div key={chat.id}>
        <Link href={`/chat/${chat.id}`}>{chat.id}</Link>
      </div>
    );
  });

  return <div>{renderChats}</div>;
};

export default UserChats;
