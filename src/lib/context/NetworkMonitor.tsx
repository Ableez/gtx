"use client";

import { postToast } from "@/components/postToast";
import { getMessaging, onMessage } from "firebase/messaging";
import React, { ReactNode, useEffect } from "react";
import { app } from "../utils/firebase";

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

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload);
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
        
        postToast(
          payload.data ? payload.data.body : "New notification received!",
          {
            className: "bg-yellow-200",
            icon: payload.data ? payload.data.icon : <>🔔</>,
          }
        );
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return <>{props.children}</>;
};

export default NetworkMonitor;
