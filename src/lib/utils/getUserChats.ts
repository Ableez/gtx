"use server";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { Conversation } from "../../../chat";
import { getUserCookie } from "./getUserCookie";
import { redirect } from "next/navigation";

export const getUserChats = async () => {
  const uc = (await getUserCookie()) as string;

  try {
    if (!uc) {
      redirect("/sell");
    }

    const cachedUser = JSON.parse(uc) as UserRecord;

    const chatsRef = query(
      collection(db, "Messages"),
      where("user.uid", "==", cachedUser.uid),
      orderBy("updated_at", "desc")
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
