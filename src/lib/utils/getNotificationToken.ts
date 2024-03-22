import { getToken } from "firebase/messaging";
import { storeToken } from "./storeToken";
import { messaging } from "../context/NotificationWrapper";

export const getNotificationToken = async () => {
  if (!navigator) {
    return;
  }

  if (navigator) {
    const token = await getToken(messaging, {
      vapidKey:
        "BOIPo2AXDin_HMhdECMatpEy9-726K5A2d4coifj5AzWL66FHL07hSaUzI0DOCB9IkK1pe-rB7EA-AN4rNxPJCY",
    });

    if (token) {
      storeToken(token);
    }
  }
};
