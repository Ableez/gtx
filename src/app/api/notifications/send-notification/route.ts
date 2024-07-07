import { adminDB } from "@/lib/utils/firebase-admin";
import { NextResponse } from "next/server";
import * as webpush from "web-push";
import { adminEmails } from "../../../../../CONSTANTS";

export const POST = async (request: Request) => {
  try {
    const { userId, payload } = (await request.json()) as {
      userId: string[] | null;
      payload: unknown;
    };

    const userIdArr = userId || adminEmails;

    const subsData = await adminDB.collection("PushSubscriptions").get();
    if (subsData.empty) {
      return NextResponse.json(
        { error: "No subscriptions found" },
        { status: 404 }
      );
    }

    // Create a map of userIds to their subscription data
    const userSubscriptions = new Map();
    subsData.docs.forEach((doc) => {
      const data = doc.data();
      if (userIdArr.includes(data.userId)) {
        userSubscriptions.set(data.userId, data.subscription);
      }
    });

    const notificationPromises = userIdArr.map(async (uid: string) => {
      const subscription = userSubscriptions.get(uid);
      if (subscription) {
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify(payload),
            {
              vapidDetails: {
                subject: "mailto:djayableez@gmail.com",
                privateKey: process.env.VAPID_PRIVATE_KEY!,
                publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
              },
            }
          );
          return { userId: uid, status: "sent" };
        } catch (error) {
          console.error(`Failed to send notification to user ${uid}:`, error);

          return {
            userId: uid,
            status: "failed",
            error: (error as Error).message,
          };
        }
      }
      return { userId: uid, status: "not found" };
    });

    const results = await Promise.all(notificationPromises);
    const sentCount = results.filter((r) => r.status === "sent").length;

    if (sentCount === 0) {
      return NextResponse.json(
        { message: "No notifications were sent", results },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${sentCount} notification(s) sent successfully`, results },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SEND NOTIFICATION]: Internal server error", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
