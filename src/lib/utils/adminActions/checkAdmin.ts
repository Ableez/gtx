// "use server"

import { User, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";
import { postToast } from "@/components/postToast";

export const checkIsAdmin = async (user: User) => {
  try {
    const getUser = await getDoc(doc(db, "Users", user?.uid as string));

    const checkUser = getUser.data() as {
      imageUrl: string | null;
      username: string;
      email: string;
      role: string;
      id: string;
    };

    if (!user || !getUser.exists()) {
      postToast("Login", {
        description: "You are not signed in!",
      });
      return {
        isAdmin: false,
        message: "User does not exists",
        user: null,
      };
    } else if (checkUser.role !== "admin") {
      postToast("Unauthorized", {
        description: "You are not an admin!",
      });
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
    return {
      isAdmin: false,
      message: "Internal error occured!",
      user: null,
    };
  }
};
