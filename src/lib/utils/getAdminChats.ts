"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { Conversation } from "../../../chat";

export const getAdminChats = async () => {
  try {
    const uc = cookies().get("user")?.value;

    if (!uc) {
      return {
        message: "You are not logged in! UC",
        success: false,
        data: null,
      };
    }

    const chatsRef = query(collection(db, "Messages"));
    const chats = await getDocs(chatsRef);

    const userChats = chats.docs.map((doc) => {
      return {
        data: JSON.parse(JSON.stringify(doc.data())) as Conversation,
        id: doc.id,
      };
    });

    return {
      message: "Chats fetched successfully",
      success: true,
      data: userChats as { data: Conversation; id: string }[],
    };
  } catch (error) {
    console.error("GET ADMIN CHATS: ", error);

    return {
      message: "An Internal error occured",
      success: false,
      data: null,
    };
  }
};
