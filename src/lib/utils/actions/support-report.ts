"use server";

import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cookies } from "next/headers";
import { User } from "firebase/auth";

export const sendReport = async (e: FormData) => {
  const obj = Object.fromEntries(e.entries()) as {
    reason: string;
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
  };

  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  try {
    const ref = collection(db, "Reports");
    await addDoc(ref, {
      type: obj.reason === "transaction" ? "report" : "feedback",
      cause: obj.reason,
      details: {
        subject: `A ${obj.reason} report`,
        body: obj.message,
      },
      date: new Date(),
      user: {
        uid: user?.uid || "Anonymous",
        username: user?.displayName || obj.name || "Anonymous",
        email: user?.email || obj.email || "Anonymous",
      },
      read: false,
    });

    return {
      message: "Sent successfully!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Not sent!",
      success: false,
    };
  }
};
