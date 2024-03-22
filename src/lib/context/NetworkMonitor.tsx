"use client";
import { postToast } from "@/components/postToast";
import React, { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

const NetworkMonitor = (props: Props) => {
  useEffect(() => {
    const handleOnline = () => {
      postToast("Back online", {
        className: "bg-green-200",
        icon: <>✅</>,
      });
    };

    const handleOffline = () => {
      postToast("No internet connection", {
        className: "bg-red-200",
        icon: <>✖️</>,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <>{props.children}</>;
};

export default NetworkMonitor;
