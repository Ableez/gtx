"use client";
import { ReactNode, useEffect, useState, useRef } from "react";
import { toast, Toaster } from "sonner";

const NotificationWrapper = ({ children }: { children: ReactNode }) => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const lastNotificationTime = useRef<number>(0);

  const showNotification = (data: any) => {
    const currentTime = Date.now();
    if (currentTime - lastNotificationTime.current > 2000) {
      lastNotificationTime.current = currentTime;

      if (document.visibilityState === "visible") {
        console.log("user active, showing toast");
        toast(data.title, {
          description: data.body,
          action: {
            label: "View",
            onClick: () => {
              if (data.data && data.data.url) {
                window.open(data.data.url, "_blank");
              }
            },
          },
        });
      } else {
        console.log("user inactive, service worker will show notification");
      }
    } else {
      console.log("Duplicate notification prevented");
    }
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("[SERVICE WORKER] Service worker is supported");
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Request last notification
        reg.active?.postMessage({ type: "GET_LAST_NOTIFICATION" });
      });

      // Listen for messages from the service worker
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === "PUSH_RECEIVED") {
          showNotification(event.data.data);
        } else if (event.data && event.data.type === "LAST_NOTIFICATION") {
          showNotification(event.data.data);
        }
      };

      navigator.serviceWorker.addEventListener("message", messageHandler);

      return () => {
        navigator.serviceWorker.removeEventListener("message", messageHandler);
      };
    }
  }, []);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default NotificationWrapper;
