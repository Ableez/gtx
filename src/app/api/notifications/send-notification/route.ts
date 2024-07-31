import { adminDB } from "@/lib/utils/firebase-admin";
import { NextResponse } from "next/server";
import * as webpush from "web-push";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";

interface NotificationPayload {
  userId: string[] | null;
  payload: unknown;
}

interface NotificationResult {
  userId: string;
  status: "sent" | "failed" | "not found";
  error?: string;
}

const vapidDetails = {
  subject: "mailto:djayableez@gmail.com",
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
};

async function sendNotificationToUser(
  userId: string,
  payload: unknown
): Promise<NotificationResult> {
  const userDoc = await adminDB
    .collection("PushSubscriptions")
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    return {
      userId,
      status: "failed",
      error: "User has no active subscription.",
    };
  }

  const subscription = userDoc.data()!.subscription as webpush.PushSubscription;
  return sendNotificationToSubscription(userId, subscription, payload);
}

async function sendNotificationToSubscription(
  userId: string,
  subscription: webpush.PushSubscription | undefined,
  payload: unknown
): Promise<NotificationResult> {
  if (!subscription) {
    return { userId, status: "not found" };
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      vapidDetails,
    });
    return { userId, status: "sent" };
  } catch (error) {
    // logger.error(`Failed to send notification to user ${userId}:`, error);
    return { userId, status: "failed", error: (error as Error).message };
  }
}

async function fetchAdminIds(): Promise<string[]> {
  const q = query(collection(db, "Users"), where("role", "==", "admin"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.id);
}

async function fetchSubscriptions(
  userIds: string[]
): Promise<Map<string, webpush.PushSubscription>> {
  const subsData = await adminDB.collection("PushSubscriptions").get();
  const subscriptions = new Map<string, webpush.PushSubscription>();

  subsData.docs.forEach((doc) => {
    const data = doc.data();
    if (userIds.includes(data.userId)) {
      subscriptions.set(data.userId, data.subscription);
    }
  });

  return subscriptions;
}

async function sendToAllAdmins(
  payload: unknown
): Promise<NotificationResult[]> {
  const adminIds = await fetchAdminIds();
  const subscriptions = await fetchSubscriptions(adminIds);

  return Promise.all(
    adminIds.map((id) =>
      sendNotificationToSubscription(id, subscriptions.get(id), payload)
    )
  );
}

export const POST = async (request: Request) => {
  try {
    const { userId, payload } = (await request.json()) as NotificationPayload;

    let results: NotificationResult[];

    if (userId) {
      results = await Promise.all(
        userId.map((id) => sendNotificationToUser(id, payload))
      );
    } else {
      results = await sendToAllAdmins(payload);
    }

    const successCount = results.filter((r) => r.status === "sent").length;

    if (successCount === 0) {
      return NextResponse.json(
        { message: "No notifications were sent", results },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${successCount} notification(s) sent successfully`, results },
      { status: 200 }
    );
  } catch (error) {
    // logger.error("[SEND NOTIFICATION]: Internal server error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
