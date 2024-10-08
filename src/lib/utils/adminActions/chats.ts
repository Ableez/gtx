"use server";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";
import { cookies } from "next/headers";
import type { UserRecord } from "firebase-admin/auth";
import { truncateString } from "@/lib/utils";
import { sendNotification } from "../sendNotification";

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
  try {
    const message = e ? e.get("message") : mediaContent?.caption;

    const { timeStamp } = data;

    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as UserRecord) : null;

    if (!user) {
      return {
        success: false,
        message: "Please login to send a message",
        error: null,
      };
    }

    const chatDocRef = doc(db, "Messages", id as string);

    const content = media
      ? mediaContent
      : {
          text: message,
        };

    const msg = {
      id: v4(),
      timeStamp: new Date(),
    };

    await updateDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
        seen: false,
        sender: user.uid,
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
          username: user.displayName,
          uid: user.uid,
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

    await sendNotification(
      user,
      {
        title: `Message`,
        body: `${truncateString(message?.toString() || "", 64)}`,
        url: `/chat/${id}`,
      },
      [recipient.uid]
    );

    return {
      success: true,
      message: "Message sent",
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal error. Message not sent",
      message: null,
    };
  }
};
