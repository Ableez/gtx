"use client";
import { ReactNode, useCallback, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useNotificationSubscription } from "../utils/store/notifications";
import Cookies from "js-cookie";

const NotificationWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("[SERVICE WORKER] Service worker is supported");

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "PUSH_RECEIVED") {
          const data = event.data.data;
          if (document.visibilityState === "visible") {
            // User is active on the page, show Sonner toast
            console.log("user active, showing toast");
            toast(data.title, {
              position: "top-right",
              description: data.body,
              action: {
                label: "View",
                onClick: () => {
                  if (data.data && data.data.url) {
                    window.open(data.data.url);
                  }
                },
              },
            });
          } else {
            // User is not active, the service worker will handle showing the notification
            console.log("user inactive, service worker will show notification");
          }
        }
      });
    }
  }, []);

  const {
    updateSubscriptionStatus,
    updateSubscriptionData,
    updateNotificationPermission,
  } = useNotificationSubscription();

  const checkSubscription = useCallback(async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      const uc = Cookies.get("user");
      const user = JSON.parse(uc ?? "{}");

      if (!user) {
        return;
      }

      const preferences = await fetch(
        `/api/notifications/preferences?userId=${user?.uid}`,
        {
          method: "GET",
        }
      );

      const { subscribed } = await preferences.json();

      if (!subscribed) {
        updateSubscriptionStatus(false);
        return;
      }

      updateSubscriptionStatus(!!existingSubscription);
      updateSubscriptionData(existingSubscription);
      updateNotificationPermission(Notification.permission);
    }
  }, [
    updateNotificationPermission,
    updateSubscriptionData,
    updateSubscriptionStatus,
  ]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default NotificationWrapper;
