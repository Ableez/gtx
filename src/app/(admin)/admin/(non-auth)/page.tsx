"use client";
import NavCards from "@/components/admin/dashboard/navCards";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { ConversationCollections } from "../../../../../chat";
import { ImageIcon } from "@radix-ui/react-icons";
import QuickView from "@/components/admin/chat/QuickView";
import PostReview from "@/components/admin/chat/PostReview";

type Props = {};

const AdminPage = function (props: Props) {
  const [chatList, setChatList] = useState<ConversationCollections>();

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
    <div className="pb-4">
      {/* Cards Navigation */}
      <NavCards chatList={chatList} />
      {/* Chat Quick View */}
      <QuickView chatList={chatList} />
      <PostReview />
    </div>
  );
};

export default AdminPage;
