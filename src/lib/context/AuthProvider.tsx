"use client";
import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext(auth.currentUser ? true : false);

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    const uid = Cookies.get("uid");

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && uid) {
        setUser(true);
      } else {
        setUser(false);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
