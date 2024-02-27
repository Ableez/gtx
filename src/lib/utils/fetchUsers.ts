import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { User } from "../../../types";
import { postToast } from "@/components/postToast";

export async function getUsers() {
  try {
    const usersRef = collection(db, "Users");
    const usersSnapshot = await getDocs(usersRef);

    if (usersSnapshot.empty) {
      postToast("Opps", { description: "No users were found!" });
      throw new Error("No users found");
    }

    const fetchTransactions = async (id: string) => {
      const transactionsSnapshot = query(
        collection(db, "Transactions"),
        where("userId", "==", id)
      );
      const snap = await getDocs(transactionsSnapshot);

      return snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    };

    const fetchChats = async (id: string) => {
      const chatsSnapshot = query(
        collection(db, "Messages"),
        where("user.uid", "==", id)
      );
      const snap = await getDocs(chatsSnapshot);

      return snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    };

    const fetchedUsers = await Promise.all(
      usersSnapshot.docs.map(async (doc) => ({
        ...doc.data(),
        id: doc.id,
        transactions: await fetchTransactions(doc.id),
        chats: await fetchChats(doc.id),
      }))
    );

    return fetchedUsers;
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    throw new Error("Error fetching users");
  }
}
