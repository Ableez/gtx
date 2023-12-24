"use client";
import AuthProvider from "@/lib/context/AuthProvider";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/utils/firebase";
import { signOut } from "firebase/auth";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  const uid = Cookies.get("uid");

  const router = useRouter();

  useEffect(() => {
    if (!uid) {
      signOut(auth);
      router.replace("/login");
    }
  }, [router, uid]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <AuthProvider>{props.children}</AuthProvider>
    </div>
  );
};

export default UserLayout;
