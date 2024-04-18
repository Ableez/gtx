import { auth, db } from "@/lib/utils/firebase";
import { FirebaseError } from "firebase/app";
import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    //   get passed credentials
    const { email, password, username } = (await req.json()) as {
      email: string;
      password: string;
      username: string;
    };

    await setPersistence(auth, browserLocalPersistence);
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update user profile first
    await updateProfile(auth.currentUser as User, {
      displayName: username,
    });

    // userData to be saved to db
    const userData = {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      uid: user.uid,
      metadata: { ...user.metadata },
      role: "user",
      conversations: [],
      cardChoices: [],
      transactions: [],
    };

    // Save user data to db
    await setDoc(doc(db, "Users", user.uid), userData);

    return Response.json({
      message: "Signin successfull",
      login: true,
      user: userData,
    });
  } catch (error) {
    const err = error as FirebaseError;
    let message = err.message;

    return Response.json({ message: message, login: false, user: null });
  }
}
