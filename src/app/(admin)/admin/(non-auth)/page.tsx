"use client";
import NavCards from "@/components/admin/dashboard/navCards";

import { auth, db } from "@/lib/utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ConversationCollections } from "../../../../../chat";
import QuickView from "@/components/admin/chat/QuickView";
import PostReview from "@/components/admin/chat/PostReview";

type Props = {};

const AdminPage = function (props: Props) {
  const [chatList, setChatList] = useState<ConversationCollections>();
  const [chatNumbers, setChatNumbers] = useState<number>();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (auth.currentUser) {
          const q = query(
            collection(db, "Messages"),
            orderBy("lastMessage.read_receipt.time", "desc")
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatData = querySnapshot.docs.map((doc) => {
              if (doc.exists()) {
                return { id: doc.id, data: doc.data() };
              } else {
                console.log("document does not exist");
              }
            });

            const sortedChats = chatData;

            const chatNumber = sortedChats.filter(
              (chat) => !chat?.data?.lastMessage?.read_receipt.status
            ).length;

            setChatNumbers(chatNumber);

            // Limit the result to 5 objects
            const limitedChats = sortedChats.slice(0, 4);

            setChatList(limitedChats as ConversationCollections);
          });

          return () => unsubscribe(); // Cleanup the subscription when the component unmounts
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pb-4 max-w-screen-md mx-auto">
      {/* Cards Navigation */}
      <NavCards chatNumbers={chatNumbers as number} />
      {/* Chat Quick View */}
      <QuickView chatList={chatList} />
      <PostReview />
    </div>
  );
};

export default AdminPage;
