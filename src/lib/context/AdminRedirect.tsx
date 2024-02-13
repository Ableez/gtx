"use client";

import { ReactNode, useEffect, useState } from "react";
import { auth, db } from "@/lib/utils/firebase";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { checkIsAdmin } from "../utils/adminActions/checkAdmin";

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

        const admin = await checkIsAdmin();

        if (!admin?.isAdmin || !authUser) {
          setIsLoading(false);
          router.replace("/admin/login");
          setIsLoading(false);
          return;
        }

        if (admin.isAdmin) {
          setUser(true);
          setIsLoading(false);
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
    return <div className="max-w-screen-lg mx-auto">{props.children}</div>;
  }
};

export default AdminLayoutProtect;
