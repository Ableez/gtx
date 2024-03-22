"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { requestNotificationPermission } from "../utils/requestNotificationPermission";
import { postToast } from "@/components/postToast";
import Image from "next/image";
import Cookies from "js-cookie";
import { getNotificationToken } from "../utils/getNotificationToken";
import { app } from "../utils/firebase";
type Props = { children: ReactNode };

const user = Cookies.get("user");

export const messaging = getMessaging(app);

const NotificationWrapper = ({ children }: Props) => {
  const [permission, setPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      if (user) {
        const prom = async () => {
          if (permission === "granted") {
            await getNotificationToken();

            return;
          } else {
            const permission = await requestNotificationPermission();
            setPermission(permission);

            return;
          }
        };

        prom();
      }
    } else {
      setMounted(true);
    }
  }, [mounted, permission]);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("LIVE MESSAGE: ", payload);

      postToast(payload.notification?.title ?? "New notification", {
        description: payload.notification?.body,

        icon: (
          <Image
            src={payload.notification?.image || "/logoplace.svg"}
            alt="Notification icon"
            width={20}
            height={20}
          />
        ),

        duration: 5000,
      });
    });
  });

  return <div>{children}</div>;
};

export default NotificationWrapper;
