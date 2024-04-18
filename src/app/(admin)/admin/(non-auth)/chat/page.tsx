import ChatCard from "@/components/admin/chat/ChatCard";
import { Button } from "@/components/ui/button";
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
      <section className="bg-white dark:bg-neutral-900 grid placeitce gap-4 text-center">
        <h4 className="text-lg font-semibold">Chats could not be fetched</h4>
        <p>Please refresh this page to try again</p>
        <Link href={"/admin/chat"}>
          <Button>Retry</Button>
        </Link>
      </section>
    );
  }

  const renderChats = chats.data.map((chat, idx) => {
    return <ChatCard chat={chat} key={idx} idx={idx} />;
  });

  return <div>{renderChats}</div>;
};

export default AdminChat;
