import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "../firebase"; // Importing the firebase instance
import { Conversation } from "../../../../chat"; // Importing the Conversation type
import { timeStamper } from "../timeStamper"; // Importing the timeStamper utility
import Cookies from "js-cookie"; // Importing Cookies for managing cookies

// Importing necessary modules from firebase/firestore and firebase/auth

// This function is used to send a confirmation of a transaction to the admin
export const sendConfirmTransactionToAdmin = async (
  id: string, // The ID of the message
  isAccepted: boolean, // Whether the transaction is accepted or not
  idx?: number // Optional index of the message
) => {
  try {
    // Creating a reference to the document in the 'Messages' collection with the given ID
    const chatDocRef = doc(db, "Messages", id as string);

    // Getting the user from the cookies
    const cachedUser = Cookies.get("user");
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    // If the user is not found, return an error message
    if (!user) return { message: "User not found", success: false };

    // Fetching the document snapshot from the Firestore
    const docSnapshot = await getDoc(chatDocRef);
    // Getting the data from the document snapshot and casting it to Conversation type
    const data = docSnapshot.data() as Conversation;

    // If no data is found, return an error message
    if (!data) return { message: "No data found", success: false };

    // Finding the index of the message with the title 'start_transaction'
    const index =
      idx ||
      data.messages.findLastIndex(
        (msg) => msg.card.title === "start_transaction"
      );

    // Getting the current timestamp
    const time = timeStamper();

    // Setting the status based on whether the transaction is accepted or not
    const status = isAccepted ? "accepted_by_user" : "rejected_by_user";
    const transactionStatus = isAccepted ? "processing" : "rejected";
    const transactionAccepted = isAccepted ? true : false;

    // Updating the message at the found index
    data.messages[index] = {
      ...data.messages[index],
      card: {
        ...data.messages[index].card,
        data: {
          ...data.messages[index].card.data,
          status: status,
        },
      },
      edited: true,
      edited_at: time,
      timeStamp: time,
    };

    // Updating the document in the Firestore with the new data
    await updateDoc(chatDocRef, {
      messages: data.messages,
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: time,
      "transaction.status": transactionStatus,
      "transaction.accepted": transactionAccepted,
    });

    // Returning a success message
    return {
      success: true,
      message: `Transaction ${isAccepted ? "accepted" : "rejected"}`,
    };
  } catch (error) {
    // Logging the error and returning an error message
    console.error(error);
    return {
      message: "No data found",
      success: false,
    };
  }
};
