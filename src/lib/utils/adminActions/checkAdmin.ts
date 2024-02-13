// "use server"

import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";

export const checkIsAdmin = async () => {
  try {
    const cachedUser = Cookies.get("user");
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    const getUser = await getDoc(doc(db, "Users", user?.uid as string));

    const checkUser = getUser.data() as {
      imageUrl: string | null;
      username: string;
      email: string;
      role: string;
      id: string;
    };

    if (!user || !getUser.exists()) {
      return {
        isAdmin: false,
        message: "User does not exists",
        user: null,
      };
    } else if (checkUser.role !== "admin") {
      return {
        isAdmin: false,
        message: "User is not an admin",
        user: null,
      };
    } else if (checkUser.role === "admin") {
      return {
        isAdmin: true,
        message: "User is admin",
        user: checkUser,
      };
    }
  } catch (error) {
    console.error("CHECK_ADMIN", error);
  }
};
