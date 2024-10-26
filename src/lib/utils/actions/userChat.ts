"use server";
import {
  type DocumentReference,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "../firebase";
import { v4 } from "uuid";
import type { User } from "firebase/auth";
import type {
  Conversation,
  MediaContent,
  ReadReceipt,
  Sender,
} from "../../../../chat";
import { timeStamper } from "../timeStamper";
import { truncateString } from "@/lib/utils";
import { sendNotificationToAdmin } from "../sendNotification";

const getCustomTimestamp = () => {
  const now = new Date();
  const seconds = Math.floor(now.getTime() / 1000);
  const nanoseconds = (now.getTime() % 1000) * 1000000;
  return { seconds, nanoseconds };
};

const getUser = () => {
  const cachedUser = cookies().get("user")?.value;
  return cachedUser ? (JSON.parse(cachedUser) as User) : null;
};

const updateChatDoc = async (chatDocRef: DocumentReference, updates: any) => {
  await updateDoc(chatDocRef, updates);
};

const createMessage = (user: User, type: string, content: any) => {
  const msg = {
    id: v4(),
    timeStamp: getCustomTimestamp(),
    type,
    deleted: false,
    sender: {
      username: user.displayName,
      uid: user.uid,
    },
    recipient: "admin",
    content,
    edited: false,
    read_receipt: {
      delivery_status: "sent",
      status: false,
      time: getCustomTimestamp(),
    },
  };

  return msg;
};

export const sendUserMessage = async (
  id: string,
  e?: FormData,
  mediaContent?: MediaContent,
  media?: boolean
) => {
  const user = getUser();
  if (!user)
    return { message: "Please login to send a message", success: false };

  console.log("ID", id);

  const chatDocRef = doc(db, "Messages", id);
  const chatData = (await getDoc(chatDocRef)).data() as Conversation;

  if (chatData.chatStatus === "closed") {
    return { message: "Can't send message. Chat closed!", success: false };
  }

  const message = e ? e.get("message") : mediaContent?.caption;
  const content = media ? mediaContent : { text: message?.toString() };

  try {
    const msg = createMessage(user, media ? "media" : "text", content);

    const updaDoc = await updateChatDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
        sender: {
          uid: user.uid,
          username: user.displayName,
          role: "user",
        },
        seen: false,
        read_receipt: msg.read_receipt,
        content: {
          text: message || "",
          media: media ? true : false,
        },
      },
      messages: arrayUnion(msg),
      updated_at: getCustomTimestamp(), // date_replaced,
    }).then((e) => console.log(e));

    await sendNotificationToAdmin({
      title: `${user.displayName} - ${chatData.transaction.cardDetails.name} Card`,
      body: `${truncateString(message?.toString() || "", 64)}`,
      url: `/admin/chat/${id}`,
    });

    return { success: true, message: "Message sent" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal error" };
  }
};

export const sendEcodeToAdmin = async (
  id: string,
  e: FormData,
  edit?: boolean,
  idx?: number
) => {
  try {
    const ecode = e.get("ecode");

    const user = getUser();

    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }

    const chatDocRef = doc(db, "Messages", id as string);

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: getCustomTimestamp(),
      "transaction.cardDetails.ecode": ecode,
    });

    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: getCustomTimestamp(),
      };

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "",
            media: {
              caption: "",
              url: "",
              metadata: {
                media_name: "",
                media_size: "",
                media_type: "",
              },
            },
          },
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: getCustomTimestamp(), // date_replaced,
          },
        },
        messages: arrayUnion({
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: user.displayName,
            uid: user.uid,
          },
          recipient: "admin",
          card: {
            title: "e-Code",
            data: {
              value: ecode,
            },
          },
          timeStamp: getCustomTimestamp(), // date_replaced,
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: getCustomTimestamp(), // date_replaced,
          },
        }),
        updated_at: getCustomTimestamp(), // date_replaced,
      });
    } else {
      if (data) {
        const index =
          idx ||
          data.messages.findLastIndex((msg) => msg.card?.title === "e-Code");

        const time = timeStamper();
        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            id: data.messages[index]?.id as string,
            type: data.messages[index]?.id as string,
            deleted: data.messages[index]?.deleted as boolean,
            content: data.messages[index]?.content as {
              text: string;
              media: MediaContent;
            },
            recipient: data.messages[index]?.recipient as string,
            sender: data.messages[index]?.sender as Sender,
            read_receipt: data.messages[index]?.read_receipt as ReadReceipt,
            // status: data.messages[index]?.status as boolean,
            card: {
              title: "e-Code",
              data: {
                value: ecode,
              },
            },
            edited: true,
            edited_at: time,
            timeStamp: time,
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
          });
        }
      }
    }

    if (edit) {
      await sendNotificationToAdmin({
        title: `${user.displayName} updated their E-code`,
        body: `${data.transaction.cardDetails.name} Giftcard E-code`,
        url: `https://greatexchange.co/admin/chat/${id}`,
      });
    } else {
      await sendNotificationToAdmin({
        title: `${user.displayName} Sent an E-code`,
        body: `${data.transaction.cardDetails.name} Giftcard E-code`,
        url: `https://greatexchange.co/admin/chat/${id}`,
      });
    }

    return {
      message: "Ecode sent to successfully",
      success: true,
    };
  } catch (error) {
    console.log("SEND_ECODE_TO_ADMIN", error);

    return {
      message: "Ecode not sent",
      success: false,
    };
  }
};

export const sendAccountToAdmin = async (
  id: string,
  e: FormData,
  edit?: boolean,
  idx?: number
) => {
  const user = getUser();

  try {
    const accountNumber = e.get("accountNumber");
    const accountName = e.get("accountName");
    const bankName = e.get("bankName");
    const chatDocRef = doc(db, "Messages", id as string);

    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }

    const accountDetails = {
      accountName: accountName,
      accountNumber: accountNumber,
      bankName: bankName,
    };

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      "transaction.accountDetails": {
        ...accountDetails,
      },
      updated_at: getCustomTimestamp(),
    });

    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: getCustomTimestamp(),
      };

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "",
            media: {
              caption: "",
              url: "",
              metadata: {
                media_name: "",
                media_size: "",
                media_type: "",
              },
            },
          },
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: getCustomTimestamp(), // date_replaced,
          },
        },
        messages: arrayUnion({
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: user.displayName,
            uid: user.uid,
          },
          recipient: "admin",
          card: {
            title: "Account Details",
            data: accountDetails,
          },
          timeStamp: getCustomTimestamp(), // date_replaced,
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: getCustomTimestamp(), // date_replaced,
          },
        }),
        updated_at: getCustomTimestamp(), // date_replaced,
      });
    } else {
      if (data) {
        const index =
          idx ||
          data.messages.findLastIndex(
            (msg) => msg.card?.title === "Account Details"
          );

        const time = timeStamper();

        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            id: data.messages[index]?.id as string,
            type: data.messages[index]?.id as string,
            deleted: data.messages[index]?.deleted as boolean,
            content: data.messages[index]?.content as {
              text: string;
              media: MediaContent;
            },
            recipient: data.messages[index]?.recipient as string,
            sender: data.messages[index]?.sender as Sender,
            read_receipt: data.messages[index]?.read_receipt as ReadReceipt,
            // status: data.messages[index]?.status as boolean,
            card: {
              title: "Account Details",
              data: accountDetails,
            },
            edited: true,
            edited_at: time,
            timeStamp: time,
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
          }).catch((e) => console.log("ERROR updoc:", e));
        }
      }
    }

    if (edit) {
      await sendNotificationToAdmin({
        title: `${user.displayName}'s Bank Details`,
        body: `Just editted their account number`,
        url: `https://greatexchange.co/admin/chat/${id}`,
      });
    } else {
      await sendNotificationToAdmin({
        title: `${user.displayName}'s Bank Details`,
        body: `Sent their bank details`,
        url: `https://greatexchange.co/admin/chat/${id}`,
      });
    }

    return {
      message: "Account Details sent",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Account details not sent",
      success: false,
    };
  }
};
