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

const user = Cookies.get("user") as string;

const AuthProvider = (props: Props) => {
  const [userState, setUserState] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser || user) {
        setUserState(authUser || JSON.parse(user));
        Cookies.set("user", JSON.stringify(authUser));
      } else {
        setUserState({});
        Cookies.remove("user");
        router.push("/sell");
      }
    });

    return () => unsubscribe();
  }, [router, userState]);

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
