"use server";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "../firebase";
import { v4 } from "uuid";
import { User } from "firebase/auth";
import {
  Conversation,
  MediaContent,
  ReadReceipt,
  Sender,
} from "../../../../chat";
import { timeStamper } from "../timeStamper";

export const sendUserMessage = async (
  data: {
    timeStamp: Date;
  },
  id: string,
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

  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  if (!user)
    return {
      message: "Please login to send a message",
      success: false,
    };

  const chatDocRef = doc(db, "Messages", id as string);

  const docSnapshot = await getDoc(chatDocRef);
  const chatData = docSnapshot.data() as Conversation;

  if (chatData.chatStatus === "closed") {
    return {
      message: "Can't send message. Chat closed!",
      success: false,
    };
  }

  const content = media
    ? mediaContent
    : {
        text: message?.toString(),
      };

  try {
    const msg = {
      id: v4(),
      timeStamp: new Date(),
    };

    await updateDoc(chatDocRef, {
      lastMessage: {
        id: msg.id,
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
        recipient: "admin",
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

    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }

    const chatDocRef = doc(db, "Messages", id as string);

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;
    console.log("HITTED");

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: new Date(),
      "transaction.cardDetails.ecode": ecode,
    });

    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: new Date(),
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
            time: msg.timeStamp,
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
          timeStamp: msg.timeStamp,
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: msg.timeStamp,
          },
        }),
        updated_at: msg.timeStamp,
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

          console.log("DATA MESSAGES: ", data.messages);
          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
          });
        }
      }
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
  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

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

    console.log("ACCT DETAILS:", accountDetails);

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      "transaction.accountDetails": {
        ...accountDetails,
      },
      updated_at: new Date(),
    });
    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: new Date(),
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
            time: msg.timeStamp,
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
          timeStamp: msg.timeStamp,
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: msg.timeStamp,
          },
        }),
        updated_at: msg.timeStamp,
      });
    } else {
      if (data) {
        const index =
          idx ||
          data.messages.findLastIndex(
            (msg) => msg.card?.title === "Account Details"
          );

        const time = timeStamper();

        console.log("DATA:", JSON.stringify(data));

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
