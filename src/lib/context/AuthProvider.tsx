"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext({});

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        Cookies.set("user", JSON.stringify(authUser));
      } else {
        setUser({});
        Cookies.remove("user");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
