"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { checkIsAdmin } from "../utils/adminActions/checkAdmin";
import { useRouter } from "next/navigation";
import { SunIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

const state = Cookies.get("state");

const AdminRedirect = (props: Props) => {
  const [user, setUser] = useState<
    | {
        isAdmin: boolean;
        message: string;
        user: any;
      }
    | undefined
  >();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (!state) {
        const user = await checkIsAdmin();

        if (!user || !user.isAdmin) {
          router.push("/admin/login");
          return;
        } else {
          Cookies.set("state", "true");
          setUser(user);
        }
      }

      setMounted(true);
    };

    check();
  }, [mounted, router, user]);

  if (!mounted) {
    return (
      <div className="flex gap-1 h-24 text-center text-xs place-items-center justify-center align-middle">
        <SunIcon width={18} className="animate-spin text-pink-500" />
        Please wait...
      </div>
    );
  }

  if (!state) {
    router.push("/admin/login");
    return;
  }

  if (state) {
    return <>{props.children}</>;
  }
};

export default AdminRedirect;
