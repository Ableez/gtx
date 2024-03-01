"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { Conversation } from "../../../chat";

export const getUserChats = async () => {
  try {
    const uc = cookies().get("user")?.value;

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
      console.log("DOC:", doc.data());
      return {
        ...doc.data(),
        id: doc.id,
      };
    });

    return {
      message: "Chats fetched successfully",
      success: true,
      data: userChats,
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
