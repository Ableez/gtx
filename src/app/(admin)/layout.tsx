"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

const AdminLayoutProtect = (props: Props) => {
  const [user, setUser] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        const uid = Cookies.get("uid");
        if (!authUser || !uid) {
          router.replace("/admin/login");
        }

        if (authUser) {
          const docRef = doc(db, "Users", authUser?.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().role === "admin") {
            setUser(true);
          } else {
            router.replace("/admin/login");
          }
        }
      } catch (error) {
        if (
          error ===
          "FirebaseError: Failed to get document because the client is offline."
        ) {
          alert("You are offline");
        }
        console.log("ERROR CHECKING IF USER IS ADMIN", error);
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
