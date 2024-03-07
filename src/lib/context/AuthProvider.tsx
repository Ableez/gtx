"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext({});

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      const user = Cookies.get("user") as string;

      if (authUser || user) {
        setUser(authUser || JSON.parse(user));
        Cookies.set("user", JSON.stringify(authUser));
      } else {
        setUser({});
        Cookies.remove("user");
        router.push("/sell");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
