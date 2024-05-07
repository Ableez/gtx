import React from "react";
import { ConversationCollections } from "../../../../chat";
import Link from "next/link";
import useAdminConversations from "@/lib/hooks/useAdminConversations";
import ChatCard from "./ChatCard";

const QuickView = () => {
  const { allConversations } = useAdminConversations();

  const conversationsPrev = allConversations?.slice(
    0,
    3
  ) as ConversationCollections;

  const renderChats = conversationsPrev?.map((chat, idx) => {
    return (
      // <div
      //   key={idx}
      //   className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-screen-md min-w-fit hover:bg-neutral-200 dark:hover:bg-black mx-auto"
      // >
      //   <Link
      //     href={`/admin/chat/${chat?.id}`}
      //     className="grid grid-flow-col align-middle place-items-top gap-3 dark:bg-opacity-10 dark:active:bg-black px-2 py-3 duration-300 dark:text-white w-full h-fit"
      //     onClick={() => markRead(chat.data.lastMessage, chat.id)}
      //   >
      //     <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
      //       <Image
      //         src={chat.data.user.photoUrl || "/logoplace.svg"}
      //         width={40}
      //         height={40}
      //         alt={""}
      //         className="rounded-full aspect-square object-cover"
      //       />
      //       <div className="">
      //         <h4
      //           className={`${
      //             chat?.data?.lastMessage?.read_receipt.status
      //               ? ""
      //               : "font-semibold text-secondary"
      //           } truncate md:max-w-[25rem] max-w-[13rem]`}
      //         >
      //           {chat?.data?.lastMessage?.content.media ? (
      //             <div className="flex align-middle place-items-center justify-start gap-1">
      //               <ImageIcon width={18} />
      //               <p>Media</p>
      //             </div>
      //           ) : (
      //             chat.data.lastMessage.content.text
      //           )}
      //         </h4>
      //         <div className="flex align-middle place-items-center justify-between pt-1.5">
      //           <p className="text-xs text-neutral-400 font-medium capitalize">
      //             {chat?.data?.user.username || "User"}
      //           </p>
      //         </div>
      //       </div>
      //     </div>

      //     <p className="text-[10px] text-neutral-500 justify-self-end float-right">
      //       {formatTime(
      //         new Date(
      //           (chat?.data?.updated_at.seconds ?? 0) * 1000 +
      //             (chat?.data?.updated_at.nanoseconds ?? 0) / 1e6
      //         ).toISOString()
      //       )}
      //     </p>
      //   </Link>
      // </div>
      <ChatCard chat={chat} key={idx} idx={idx} />
    );
  });

  return (
    <div className="my-8 bg-white border dark:bg-black rounded-2xl z-40">
      <div className="dark:text-neutral-400 border-b dark:border-b-neutral-700 overflow-clip flex align-middle place-items-center justify-between p-2.5">
        <h4 className="font-semibold text-neutral-500 text-xs">
          Latest Messages
        </h4>
        <Link
          href={"/admin/chat"}
          className="py-2rounded-md text-[12px] text-secondary font-bold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y dark:divide-neutral-700 h-auto text-neutral-800 last:rounded-b-2xl">
        {renderChats && renderChats?.length > 0 ? (
          renderChats
        ) : (
          <div className="p-6 text-center text-neutral-400 dark:text-neutral-600">
            No Chats yet
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickView;
