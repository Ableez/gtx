"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  children: ReactNode;
};

const AdminAuthProvider = (props: Props) => {
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
      }
      if (user) {
        const ref = doc(db, "Users", user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert("You are not authorized to access this page");
          router.push("/admin/login");
          return;
        }
      }
    });
  }, [router]);
  return <div>{props.children}</div>;
};

export default AdminAuthProvider;
