"use client";

import { postToast } from "@/components/postToast";
import React, { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

const NetworkMonitor = (props: Props) => {
  useEffect(() => {
    // Event listener for network status changes
    const handleOnline = () => {
      console.log("You are now online.");
      postToast("You are currently online.", {
        className: "bg-green-200",
        icon: <>✅</>,
      });
    };

    const handleOffline = () => {
      console.log("You are now offline.");
      postToast("You are currently offline.", {
        className: "bg-red-200",
        icon: <>❌</>,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return <>{props.children}</>;
};

export default NetworkMonitor;
