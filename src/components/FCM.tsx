import { messaging } from "@/lib/utils/firebase";
import { getToken } from "firebase/messaging";
import { useEffect } from "react";

const FCMComponent = () => {
  useEffect(() => {
    // Check if the navigator object is available (client-side)
    if ("navigator" in window && "serviceWorker" in navigator) {
      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const token = await getToken(messaging, {
              vapidKey: "<YOUR_VAPID_KEY>",
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
    }
  }, []);

  return null;
};

export default FCMComponent;
