import { auth, db } from "@/lib/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function adminLoader() {
  // Check if user is authenticated
  const isAuthenticated = !!auth.currentUser;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // Check if user has admin privileges
  const ref = doc(db, "Users", auth.currentUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    redirect("/admin/login");
  }

  // If authenticated and has admin privileges, proceed
  return true;
}
