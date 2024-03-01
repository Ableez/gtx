"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { Conversation } from "../../../chat";
import { getUserCookie } from "./getUserCookie";

export const getUserChats = async () => {
  const uc = (await getUserCookie()) as string;

  try {
    if (!uc) {
      return {
        message: "You are not logged in! UC",
        success: false,
        data: null,
      };
    }

    const cachedUser = JSON.parse(uc) as UserRecord;

    const chatsRef = query(
      collection(db, "Messages"),
      where("user.uid", "==", cachedUser.uid)
    );
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
    console.error("GET USER CHATS: ", error);

    return {
      message: "An Internal error occured",
      success: false,
      data: null,
    };
  }
};
