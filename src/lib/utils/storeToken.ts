import { Timestamp, doc, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { auth, db } from "./firebase";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export const storeToken = async (
  token: string
): Promise<{ message: string; success: boolean | null }> => {
  try {
    if (!token) {
      return {
        message: "Token parameter must be provided!",
        success: false,
      };
    }

    const userString = Cookies.get("user");
    if (!userString) {
      return {
        message: "User is not signed in",
        success: null,
      };
    }

    const user: UserRecord = JSON.parse(userString);
    const userRef = doc(db, "Users", user.uid);

    await updateDoc(userRef, {
      notificationsToken: token,
      updatedAt: Timestamp,
    });

    return {
      message: "Token stored successfully",
      success: true,
    };
  } catch (error) {
    console.error("ERROR STORING TOKEN: ", error);
    return {
      message: "An error occurred while storing the token",
      success: false,
    };
  }
};
