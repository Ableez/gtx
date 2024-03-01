"use server";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Conversation } from "../../../../chat";
import { v4 } from "uuid";
import { checkServerAdmin } from "./checkServerAdmin";
import { timeStamper } from "../timeStamper";
import { checkIsAdmin } from "./checkAdmin";

export const setCardRate = async (
  id: string,
  e: FormData,
  edit?: boolean,
  idx?: number
) => {
  try {
    const rate = e.get("rate");

    const user = await checkIsAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const chatDocRef = doc(db, "Messages", id as string);

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: new Date(),
      "transaction.cardDetails.rate": rate,
    });

    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: new Date(),
      };

      const userData = JSON.parse(user.user);

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "Card Rate",
            media: false,
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
            username: userData.displayName,
            uid: userData.uid,
          },
          recipient: "user",
          card: {
            title: "rate",
            data: {
              value: rate,
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
          data.messages.findLastIndex((msg) => msg.card.title === "rate");

        const time = timeStamper();
        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            card: {
              title: "rate",
              data: {
                value: rate,
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
    return {
      message: "Rate sent to successfully",
      success: true,
    };
  } catch (error) {
    console.log("SEND_RATE", error);
    return {
      message: "Internal error. Rate not sent",
      success: false,
    };
  }
};
