"use server";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Conversation } from "../../../../chat";
import { v4 } from "uuid";
import { checkServerAdmin } from "./checkServerAdmin";
import { timeStamper } from "../timeStamper";

export const startTransaction = async (
  id: string,
  update?: {
    status: string;
  },
  resend?: boolean,
  idx?: number
) => {
  try {
    const user = await checkServerAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const chatDocRef = doc(db, "Messages", id as string);

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    if (!update && !data.transaction.started) {
      await updateDoc(chatDocRef, {
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: timeStamper(),
        "transaction.started": true,
        "transaction.accepted": false,
        "transaction.status": "pending",
      });

      const msg = {
        id: v4(),
        timeStamp: new Date(),
      };

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "Transaction Request",
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
            username: user.user?.username,
            uid: user.user?.id,
          },
          recipient: "user",
          card: {
            title: "start_transaction",
            data: {
              rate: data.transaction.cardDetails.rate,
              price: data.transaction.cardDetails.price,
            },
          },
          timeStamp: msg.timeStamp,
          resended: false,
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
            (msg) => msg.card.title === "start_transaction"
          );

        const time = timeStamper();

        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            card: {
              title: "start_transaction",
              data: {
                rate: data.transaction.cardDetails.rate,
                price: data.transaction.cardDetails.price,
              },
            },
            edited: true,
            edited_at: time,
            timeStamp: time,
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
            "transaction.started": true,
            "transaction.accepted": false,
            "transaction.status": update?.status,
          });
        }
      } else {
        return {
          message: "Transaction not found",
          success: false,
        };
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
