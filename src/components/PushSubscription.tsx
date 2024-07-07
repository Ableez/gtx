import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User } from "../../types";

const PushNotificationSubscriber: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>("default");

  const router = useRouter();

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const uc = Cookies.get("user");
  if (!uc) {
    return <Button onClick={() => router.push("/login")}>Login</Button>;
  }
  const user = JSON.parse(uc) as User;

  const requestNotificationPermission =
    async (): Promise<NotificationPermission> => {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return "denied";
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        return permission;
      }

      return Notification.permission;
    };

  const subscribeUser = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const permission = await requestNotificationPermission();

        if (permission === "granted") {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          await fetch("/api/subscribe-notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscription,
              userId: user.uid,
            }),
          });

          setIsSubscribed(true);
          console.log("User is subscribed.");
        } else {
          console.log("Notification permission denied");
          alert("You need to allow notifications to receive updates.");
        }
      } catch (err) {
        console.log("Failed to subscribe the user: ", err);
      }
    }
  };

  const sendNotification = async () => {
    if (permissionStatus === "granted") {
      try {
        const response = await fetch("/api/send-notification", {
          method: "POST",
          body: JSON.stringify({
            userId: user.uid,
            // userId: "JVRbJ5DXpPQsCbmEzbdTuJEI1Cq2",
            payload: {
              title: "General NOT",
              body: "This is a test notification",
              icon: "/greatexc.svg",
              data: {
                url: "https://google.com",
                someData: "Additional data here",
              },
            },
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
        console.log("Notification sent successfully");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    } else if (permissionStatus === "denied") {
      alert(
        "You have denied notification permissions. Please enable them in your browser settings to receive notifications."
      );
    } else {
      const newPermission = await requestNotificationPermission();
      if (newPermission === "granted") {
        sendNotification(); // Retry sending notification after permission is granted
      } else {
        alert("You need to allow notifications to receive updates.");
      }
    }
  };

  return (
    <div className="grid gap-4 w-32">
      <h2>Push Notifications</h2>
      <Button onClick={subscribeUser} disabled={isSubscribed}>
    {isSubscribed ? "Subscribed" : "Subscribe to Push Notifications"}
      </Button>
      <Button
        onClick={sendNotification}
        disabled={!isSubscribed}
        title={`${
          !isSubscribed ? "Click to Subscribe" : "Click to Send Notification"
        }`}
      >
        Send Test Notification
      </Button>
    </div>
  );
};

export default PushNotificationSubscriber;
