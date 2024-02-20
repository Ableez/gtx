"use client";

import { ReactNode, useEffect, useState } from "react";
import { auth, db } from "@/lib/utils/firebase";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { checkIsAdmin } from "../utils/adminActions/checkAdmin";
import Loading from "@/app/loading";
import { postToast } from "@/components/postToast";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
          // router.replace("/admin/login");
          postToast("Error", { description: "You might wanna login again!" });
          return;
        }

        const admin = await checkIsAdmin(authUser as User);

        if (!admin?.isAdmin) {
          await signOut(auth);
          setIsLoading(false);
          router.replace("/admin/login");
          return;
        }

        if (admin?.isAdmin) {
          setUser(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (user || pathName === "/admin/login" || pathName === "/admin/register") {
    return <div className="max-w-screen-lg mx-auto">{props.children}</div>;
  }
};

export default AdminLayoutProtect;
