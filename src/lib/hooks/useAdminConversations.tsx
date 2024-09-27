"use client";

import { useEffect, useState } from "react";
import { ConversationCollections } from "../../../chat";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { adminConversationsStore } from "../utils/store/adminAllConversations";
import { postToast } from "@/components/postToast";
import { saveConversationsToDB } from "../utils/indexedDb/adminConversations";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const useAdminConversations = () => {
  const [conversationState, setConversationState] =
    useState<ConversationCollections>();
  const {
    allConversations,
    updateAllConversations,
    updateUnReadConversationsNumber,
    unReadConversationsNumber,
  } = adminConversationsStore();

  useEffect(() => {
    const fetchChats = (): (() => void) | undefined => {
      const uc = Cookies.get("user");

      const q = query(
        collection(db, "Messages"),
        orderBy("updated_at", "desc")
      );

      return onSnapshot(q, (querySnapshot) => {
        const chatData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        const unreadChats = chatData.filter(
          (chat) => !chat?.data?.lastMessage?.read_receipt?.status
        );

        if (chatData && chatData.length > 0) {
          setConversationState(chatData as ConversationCollections);
        }
        updateUnReadConversationsNumber(unreadChats.length);
      });
    };

    const unsubscribe = fetchChats();
    return () => unsubscribe && unsubscribe();
  }, [updateUnReadConversationsNumber]);

  useEffect(() => {
    if (conversationState && conversationState.length > 0) {
      saveConversationsToDB(conversationState);
    }

    updateAllConversations();
  }, [conversationState, updateAllConversations]);

  return { allConversations, unReadConversationsNumber };
};

export default useAdminConversations;
