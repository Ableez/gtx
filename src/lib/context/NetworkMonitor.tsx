"use client";
import { postToast } from "@/components/postToast";
import { getToken, onMessage } from "firebase/messaging";
import React, { ReactNode, useEffect } from "react";
import { messaging } from "../utils/firebase";

type Props = {
  children: ReactNode;
};

const NetworkMonitor = (props: Props) => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey:
              "BOIPo2AXDin_HMhdECMatpEy9-726K5A2d4coifj5AzWL66FHL07hSaUzI0DOCB9IkK1pe-rB7EA-AN4rNxPJCY",
          });
          console.log("FCM Token:", token);
          // Send the token to your server or handle it as needed
        } else {
          console.log("Notification permission denied");
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    requestPermission();
  }, []);

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

  // incoming notifications
  useEffect(() => {
    const handleMessage = (payload: any) => {
      console.log(payload);
      postToast(payload.message, {
        className: payload.type,
        icon: payload.icon,
      });
    };

    onMessage(messaging, handleMessage);
  }, []);

  return <>{props.children}</>;
};

export default NetworkMonitor;
