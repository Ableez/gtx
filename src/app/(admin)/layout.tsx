"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  children: ReactNode;
};

const AdminLayoutProtect = (props: Props) => {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        router.replace("/admin/login");
      }

      if (authUser) {
        const docRef = doc(db, "Users", authUser?.uid);
        const docSnap = await getDoc(docRef);

        console.log("CHECK ADMIN", docSnap.data());

        if (docSnap.exists() && docSnap.data().role === "admin") {
          setUser(true);
        } else {
          router.replace("/admin/login");
        }
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [router]);

  if (user || pathName === "/admin/login" || pathName === "/admin/register") {
    return <div>{props.children}</div>;
  }
};

export default AdminLayoutProtect;
