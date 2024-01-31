"use server";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";
import { checkIsAdmin } from "./checkAdmin";

export const sendAdminMessage = async (
  data: {
    timeStamp: Date;
  },
  id: string,
  recipient: {
    username: string;
    uid: string;
    email: string;
    photoUrl: string;
  },
  e?: FormData,
  mediaContent?: {
    caption?: string;
    url: string;
    metadata: {
      media_name: string;
      media_type?: string;
      media_size: number;
    };
  },
  media?: boolean
) => {
  const message = e ? e.get("message") : mediaContent?.caption;

  const { timeStamp } = data;

  const user = await checkIsAdmin();

  if (!user?.isAdmin)
    return {
      message: "Not Allowed. User is not an admin",
      success: false,
    };

  const chatDocRef = doc(db, "Messages", id as string);

  const content = media
    ? mediaContent
    : {
        text: message,
      };

  try {
    const msg = {
      id: v4(),
      timeStamp: new Date(),
    };
    await updateDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
        sender: "admin",
        read_receipt: {
          delivery_status: "sent",
          status: false,
          time: msg.timeStamp,
        },
        content: {
          text: message || "",
          media: media ? true : false,
        },
      },
      messages: arrayUnion({
        id: msg.id,
        type: media ? "media" : "text",
        deleted: false,
        timeStamp: timeStamp,
        sender: {
          username: user.user?.username,
          uid: user.user?.id,
        },
        recipient: "user",
        content: {
          text: message || "",
          media: content,
        },
        edited: false,
        read_receipt: {
          delivery_status: "sent",
          status: false,
          time: msg.timeStamp,
        },
      }),
      updated_at: msg.timeStamp,
    });

    return { success: true, message: "Message sent" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal error. Message not sent",
    };
  }
};
