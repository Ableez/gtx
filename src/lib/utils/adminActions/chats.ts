"use server";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Conversation, MediaContent } from "../../../../chat";
import { cookies } from "next/headers";
import { sendNotificationToUser } from "../sendNotification";

const getCustomTimestamp = () => {
  const now = new Date();
  const seconds = Math.floor(now.getTime() / 1000);
  const nanoseconds = (now.getTime() % 1000) * 1000000;
  return { seconds, nanoseconds };
};

const createMessage = (
  admin: any,
  type: string,
  content: { text?: string; media?: string; caption?: string }
) => {
  return {
    id: `${admin.uid}_${new Date().getTime()}`,
    sender: admin.uid,
    senderName: admin.displayName || "Admin",
    type: type,
    content: content,
    timeStamp: getCustomTimestamp(),
    read_receipt: {
      delivery_status: "sent", // "not_sent" | "sent" | "delivered" | "seen"
      time: getCustomTimestamp(),
      status: false,
    },
    recipient: "user",
  };
};

export const sendAdminMessage = async (chatId: string, message: string) => {
  const uc = cookies().get("user")?.value;
  const admin = JSON.parse(uc ?? "{}");

  if (!admin) {
    return { message: "Admin authentication required", success: false };
  }

  const chatDocRef = doc(
    db,
    process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
    chatId
  );

  const chatData = (await getDoc(chatDocRef)).data() as Conversation;

  if (chatData.chatStatus === "closed") {
    return { message: "Can't send message. Chat closed!", success: false };
  }

  try {
    const msg = createMessage(admin, "text", { text: message });

    await updateDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
        sender: {
          uid: admin.uid,
          username: admin.displayName,
          role: "admin",
        },
        seen: false,
        read_receipt: msg.read_receipt,
        content: {
          text: message,
          media: false,
        },
      },
      messages: arrayUnion(msg),
      updated_at: getCustomTimestamp(),
      timeStamp: getCustomTimestamp(),
    });

    const updatedMessage = await getDoc(chatDocRef).then((e) => e.data());

    console.log("UPDATED MESSAGE", updatedMessage);

    await sendNotificationToUser(chatData.user.uid, {
      title: "New Message",
      body: message,
      url: `/chat/${chatId}`,
    });

    return { success: true, message: "Admin message sent", updatedMessage };
  } catch (error) {
    console.error("Error sending admin message:", error);
    return { success: false, message: "Internal error" };
  }
};

export const sendAdminMedia = async (
  chatId: string,
  mediaContent: MediaContent,
  caption?: string
) => {
  console.log("SEND ADMIN MEDIA: ", mediaContent);
  // Get admin from cookies
  const uc = cookies().get("user")?.value;
  const admin = JSON.parse(uc ?? "{}");

  if (!admin) {
    return { message: "Admin authentication required", success: false };
  }

  // Get chat document reference
  const chatDocRef = doc(
    db,
    process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
    chatId
  );

  // Get chat data
  const chatData = (await getDoc(chatDocRef)).data() as Conversation;

  if (chatData.chatStatus === "closed") {
    return { message: "Can't send message. Chat closed!", success: false };
  }

  try {
    // Create message with media content
    const msg = createMessage(admin, "media", {
      ...mediaContent,
      caption: caption || "",
    });

    console.log("MSG: ", msg);

    // Update the chat document
    await updateDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
        sender: {
          uid: admin.uid,
          username: admin.displayName,
          role: "admin",
        },
        seen: false,
        read_receipt: msg.read_receipt,
        content: {
          text: caption || "",
          media: true,
        },
      },
      messages: arrayUnion(msg),
      updated_at: getCustomTimestamp(),
      timeStamp: getCustomTimestamp(),
    });

    // Send notification to user
    await sendNotificationToUser(chatData.user.uid, {
      title: "Sent an image",
      body: caption || "Admin sent an image",
      url: `/chat/${chatId}`,
    });

    return {
      success: true,
      message: "Admin media message sent",
      messageData: msg,
    };
  } catch (error) {
    console.error("Error sending admin media message:", error);
    return { success: false, message: "Internal error" };
  }
};

// Helper function (implement this in a separate file if not already available)
function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}
