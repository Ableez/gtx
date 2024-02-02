import { doc, getDoc, updateDoc } from "firebase/firestore";
import { checkServerAdmin } from "../adminActions/checkServerAdmin";
import { db } from "../firebase";
import { Conversation } from "../../../../chat";
import { timeStamper } from "../timeStamper";
import { User } from "firebase/auth";
import Cookies from "js-cookie";

export const sendConfirmTransactionToAdmin = async (
  id: string,
  reason: boolean,
  idx?: number
) => {
  try {
    const chatDocRef = doc(db, "Messages", id as string);

    const cachedUser = Cookies.get("user");
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    if (!data) {
      return {
        message: "No data found",
        success: false,
      };
    }

    const index =
      idx ||
      data.messages.findLastIndex(
        (msg) => msg.card.title === "start_transaction"
      );

    const time = timeStamper();

    // user rejects transaction
    if (!reason) {
      data.messages[index] = {
        ...data.messages[index],
        card: {
          ...data.messages[index].card,
          data: {
            ...data.messages[index].card.data,
            status: "rejected_by_user",
          },
        },
        edited: true,
        edited_at: time,
        timeStamp: time,
      };

      await updateDoc(chatDocRef, {
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: time,
        "transaction.started": false,
        "transaction.status": "rejected",
        messages: data.messages,
      });

      return {
        success: true,
        message: "Transaction rejected",
      };
    } else if (reason) {
      data.messages[index] = {
        ...data.messages[index],
        card: {
          ...data.messages[index].card,
          data: {
            ...data.messages[index].card.data,
            status: "accepted_by_user",
          },
        },
        edited: true,
        edited_at: time,
        timeStamp: time,
      };

      await updateDoc(chatDocRef, {
        messages: data.messages,
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: time,
        "transaction.status": "processing",
      });

      return {
        success: true,
        message: "Transaction rejected",
      };
    }

    return {
      message: "Accepted",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "No data found",
      success: false,
    };
  }
};
