import ChatCard from "@/components/admin/chat/ChatCard";
import { getAdminChats } from "@/lib/utils/getAdminChats";
import Link from "next/link";

type Props = {};

const AdminChat = async (props: Props) => {
  const chats = await getAdminChats();

  if (chats.data?.length === 0) {
    return (
      <div className="grid place-items-center justify-center align-middle gap-6 max-w-screen-md text-center mx-auto">
        <h3 className="font-bold text-lg">Chats not found</h3>
        <p className="text-xs">It may be your internet connection.</p>
        <div className="w-full">
          <Link
            className="mx-auto py-2 px-4 bg-primary rounded-md text-white font-medium"
            href={"/admin/chat"}
          >
            Retry
          </Link>
        </div>
      </div>
    );
  }
  if (!chats.success || !chats.data) {
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
          <div className="w-full">
            <Link
              className="mx-auto py-2 px-4 bg-primary rounded-md text-white font-medium"
              href={"/admin/chat"}
            >
              Retry
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const renderChats = chats.data.map((chat, idx) => {
    return <ChatCard chat={chat} key={idx} />;
  });

  return <div>{renderChats}</div>;
};

export default AdminChat;
