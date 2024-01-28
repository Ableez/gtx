"use server";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FirebaseError } from "firebase-admin";

export const signInCredentials = async (
  url: string | null,
  formData: FormData
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let logged = false;

  if (!email || !password) {
    return {
      message: "All fields are required!",
    };
  }

  try {
    const newUser = await signInWithEmailAndPassword(auth, email, password);
    if (newUser.user) {
      newUser.user.reload();
      cookies().set("user", JSON.stringify(newUser.user.toJSON()));
      cookies().set("isLoggedIn", "true");
      logged = true;
    }
  } catch (e) {
    const err = e as FirebaseError;
    console.log(err);
    return {
      message:
        err?.code === "auth/invalid-login-credentials"
          ? "Invalid login credentials"
          : err?.code === "auth/user-not-found"
          ? "User not found"
          : err?.code === "auth/wrong-password"
          ? "Wrong password"
          : err.code === "auth/network-request-failed"
          ? "Network request failed"
          : "Something went wrong. Try again",
    };
  }

  if (logged) {
    console.log("Logged", logged);
    redirect(url || "/sell");
  }

  revalidatePath("/");
};

export const logout = async (url: string) => {
  "use server";
  await signOut(auth);
  redirect(url || "/sell");
};

export const signInWithGoogle = async () => {
  "use server";
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  redirect(".");
};
