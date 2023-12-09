"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import Loader from "@/components/Loader";

type Props = {
  children: ReactNode;
};

const ChatProtect = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        router.replace("/login");
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [router]);

  if (user) {
    return <div>{props.children}</div>;
  }

  // Render loading or authentication check in progress UI
  return (
    <div className="grid place-items-center align-middle p-16">
      <Loader />
    </div>
  );
};

export default ChatProtect;
