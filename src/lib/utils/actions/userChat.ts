"use server";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "../firebase";
import { v4 } from "uuid";
import { User } from "firebase/auth";
import { Conversation } from "../../../../chat";

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

  if (!user) return { error: "User not found" };

  const chatDocRef = doc(db, "Messages", id as string);

  const content = media
    ? mediaContent
    : {
        text: message,
      };

  try {
    await updateDoc(chatDocRef, {
      messages: arrayUnion({
        id: v4(),
        type: media ? "media" : "text",
        deleted: false,
        sender: {
          username: user.displayName,
          uid: user.uid,
        },
        recipient: "admin",
        content: {
          text: message || "",
          media: content,
        },
        timeStamp: timeStamp,
        edited: false,
        read_receipt: {
          delivery_status: "sent",
          status: false,
        },
      }),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

export const sendEcodeToAdmin = async (id: string, e: FormData) => {
  try {
    const ecode = e.get("ecode");
    const chatDocRef = doc(db, "Messages", id as string);

    await updateDoc(chatDocRef, {
      transaction: {
        cardDetails: {
          ecode: ecode,
        },
      },
    })
      .then(() => {
        return {
          message: "Ecode sent to successfully",
          success: true,
        };
      })
      .catch((e) => {
        console.log(e);
        return {
          message: "Ecode not sent",
          success: false,
        };
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendAccountToAdmin = async (
  id: string,
  e: FormData,
  edit?: boolean,
  idx?: number
) => {
  try {
    const accountNumber = e.get("accountNumber");
    const accountName = e.get("accountName");
    const bankName = e.get("bankName");
    const chatDocRef = doc(db, "Messages", id as string);

    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

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
      "transaction.accountDetails": {
        accountDetails: accountDetails,
      },
    });

    if (!edit) {
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          id: v4(),
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
          timeStamp: new Date(),
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
          },
        }),
      });
    } else {
      // #TODO fix this: you want to update an object in the messages array, find a way to manipulate arrays in firestore

      if (data && idx) {
        if (Array.isArray(data.messages)) {
          data.messages[idx] = {
            ...data.messages[idx],
            card: {
              title: "Account Details",
              data: accountDetails,
            },
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
          });
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
