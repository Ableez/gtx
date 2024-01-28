"use client";

import { ReactNode, useEffect, useState } from "react";
import { auth, db } from "@/lib/utils/firebase";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

const AdminLayoutProtect = (props: Props) => {
  const [user, setUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        setIsLoading(true);

        if (!authUser) {
          setIsLoading(false);
          router.replace("/admin/login");
          setIsLoading(false);
          return;
        }

        const uid = Cookies.get("uid");
        const cachedRole = Cookies.get("role");

        if (cachedRole === "admin") {
          setUser(true);
          setIsLoading(false);
        } else {
          const docRef = doc(db, "Users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().role === "admin") {
            Cookies.set("role", "admin", { expires: 7 * 24 });
            setUser(true);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            router.replace("/admin/login");
          }
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) return <Loader />;

  if (user || pathName === "/admin/login" || pathName === "/admin/register") {
    return <>{props.children}</>;
  }
};

export default AdminLayoutProtect;
