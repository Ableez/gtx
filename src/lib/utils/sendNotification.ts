import { User } from "../../../types";

export const sendNotification = async (
  user: User | any,
  payload: {
    title: string;
    body: string;
    url: string;
  },
  userId: string | string[] | null
) => {
  try {
    await fetch("http://localhost:3000/api/notifications/send-notification", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        payload: {
          title: payload.title,
          body: payload.body,
          icon: "/greatexc.svg",
          data: {
            url: payload.url,
            userId: user.uid,
          },
        },
      }),
    });
  } catch (error) {
    console.error("ERROR SENDING NOTIFICATION:", error);
  }
};
