"use server";

import { auth, db } from "@/lib/utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "All fields are required" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userRef = doc(db, "Users", userCredential.user.uid);
    const userDoc = await getDoc(userRef);

    const checkedUser = userDoc.data() as { role?: string };
    if (!checkedUser || checkedUser.role !== "admin") {
      // Instead of signing out, we'll just return a message
      return {
        success: true,
        message: "Logged in as a regular user. Admin access denied.",
        isAdmin: false,
      };
    }

    if (!userDoc.exists()) {
      const userData = {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        phoneNumber: userCredential.user.phoneNumber,
        photoURL: userCredential.user.photoURL,
        uid: userCredential.user.uid,
        metadata: { ...userCredential.user.metadata },
        role: "user",
        conversations: [],
        cardChoices: [],
        transactions: [],
      };
      await setDoc(userRef, userData);
    }

    // Set cookies
    const cookieStore = cookies();

    cookieStore.set("user", JSON.stringify(userCredential.user.toJSON()), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("state", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, isAdmin: userDoc.data()?.role === "admin" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
}
