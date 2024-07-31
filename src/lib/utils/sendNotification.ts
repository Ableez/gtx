import type { User } from "../../../types";

const APP_URL = process.env.APP_URL!;

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
    console.log(APP_URL);
    await fetch(`${APP_URL}/api/notifications/send-notification`, {
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
