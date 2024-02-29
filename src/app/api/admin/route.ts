import { auth, db } from "@/lib/utils/firebase";
import admin from "@/lib/utils/firebase-admin";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    //   get passed credentials
    const { email, password, username } = (await req.json()) as {
      email: string;
      password: string;
      username: string;
    };

    //   create user
    const user = await admin.auth().createUser({
      displayName: username,
      email,
      password,
    });

    //   make user an admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    //   save user to firestore
    const userData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || "",
      uid: user.uid,
      role: "admin",
    };
    await setDoc(doc(db, "Users", user.uid), userData);

    //   save user data to cookies
    cookies().set("user", JSON.stringify(user.toJSON()), {});

    //   log user in
    await signInWithEmailAndPassword(auth, email, password);

    return Response.json({
      message: "Signin successfull",
      login: true,
      user: user.toJSON(),
    });
  } catch (error) {
    const err = error as FirebaseError;
    let message = err.message;

    return Response.json({ message: message, login: false, user: null });
  }
}
