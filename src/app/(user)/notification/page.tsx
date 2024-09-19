"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ArrowLeft, Bell, BellOff, Settings2 } from "lucide-react";
import type { Preferences, User } from "../../../../types";
import Cookies from "js-cookie";
import { useNotificationPreferences } from "@/lib/utils/store/notificationsPreferences";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SunIcon } from "@radix-ui/react-icons";
import Loading from "@/app/loading";

type NotificationType = {
  id: keyof Preferences;
  label: string;
};

const notificationTypes: NotificationType[] = [
  { id: "message", label: "Chat Messages" },
  { id: "updates", label: "Promotions & Deals" },
  { id: "reminders", label: "Reminders" },
  { id: "account", label: "Account Alerts" },
];

export default function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [subscribing, setSubscribing] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const { notificationPreferences, setNotificationPreferences } =
    useNotificationPreferences();

  const loadNotificationPreferences = useCallback(async () => {
    const savedPreferences = localStorage.getItem("notificationPreferences");

    if (savedPreferences) {
      setNotificationPreferences(JSON.parse(savedPreferences));
    } else {
      const resp = await fetch("/api/notifications/preferences", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        const defaultPreferences = notificationTypes.reduce(
          (acc, type) => ({
            ...acc,
            [type.id]: true,
          }),
          {}
        );

        setNotificationPreferences(defaultPreferences);
        localStorage.setItem(
          "notificationPreferences",
          JSON.stringify(defaultPreferences)
        );
        return;
      }

      const userPreferences = (await resp.json()) as Preferences;

      setNotificationPreferences(userPreferences);

      localStorage.setItem(
        "notificationPreferences",
        JSON.stringify(userPreferences)
      );
    }
  }, [setNotificationPreferences]);

  useEffect(() => {
    if (!user?.preferences) {
      setIsSubscribed(false);
    }
  }, [user?.preferences]);

  useEffect(() => {
    const uc = Cookies.get("user");

    if (uc) {
      const user = JSON.parse(uc) as User;

      setUser(user);
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      const preferences = await fetch(
        `/api/notifications/preferences?userId=${user?.uid}`,
        {
          method: "GET",
        }
      );

      const { subscribed } = await preferences.json();

      if (!subscribed) {
        setIsSubscribed(false);
        return;
      }

      setIsSubscribed(!!existingSubscription);
      setSubscription(existingSubscription);
      setPermissionStatus(Notification.permission);
    }
  }, [user?.uid]);

  useEffect(() => {
    checkSubscription();
    loadNotificationPreferences();
  }, [checkSubscription, loadNotificationPreferences]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      toast.error("This browser does not support notifications.");
      return "denied";
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    return permission;
  };

  const subscribeUser = async () => {
    if (navigator.serviceWorker) {
      setSubscribing(true);

      try {
        const permission = await requestNotificationPermission();

        if (permission === "granted") {
          const registration = await navigator.serviceWorker.ready;
          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?.uid,
              subscription: newSubscription,
              preferences: notificationPreferences,
            }),
          });

          setIsSubscribed(true);
          setSubscription(newSubscription);
          toast.success("Subscribed to notifications");
        } else {
          console.log("Notification permission denied");
          toast.error("Notification permissions denied", {
            action: {
              label: "Allow",
              onClick: async () => {
                toast.dismiss();
                await requestNotificationPermission();
              },
            },
          });
        }
      } catch (err) {
        console.error("\x1b[41m", "Failed to subscribe the user: ", err);
      } finally {
        setSubscribing(false);
      }
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) {
      console.log("No subscription to unsubscribe from");
      return;
    }

    try {
      await subscription.unsubscribe();

      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          userId: user?.uid,
        }),
      });

      setIsSubscribed(false);
      setSubscription(null);
      console.log("User is unsubscribed.");
      toast.success("Unsubscribed from notifications");
    } catch (err) {
      console.log("Error unsubscribing", err);
      toast.error(
        "Failed to unsubscribe from notifications. Please try again later.",
        {
          action: {
            label: "Retry",
            onClick: async () => {
              toast.dismiss();
              await unsubscribeUser();
            },
          },
        }
      );
    }
  };

  const handlePreferenceChange = async (typeId: string, enabled: boolean) => {
    const newPreferences = { ...notificationPreferences, [typeId]: enabled };
    setNotificationPreferences(newPreferences);

    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify(newPreferences)
    );

    if (isSubscribed) {
      await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: newPreferences,
          userId: user?.uid,
        }),
      });
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="h-screen grid place-items-start">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-start gap-4 p-4 bg-white/90 dark:bg-neutral-900 backdrop-blur-xl sticky top-0">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft size={20} />
          </Button>
          <h4 className="font-semibold text-xl">Notifications</h4>
        </div>

        <CardHeader>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {permissionStatus === "denied" && (
            <Alert variant="destructive">
              <AlertTitle>Notifications Blocked</AlertTitle>
              <AlertDescription>
                You have blocked notifications. Please enable them in your
                browser settings to receive updates.
              </AlertDescription>
            </Alert>
          )}
          {!isSubscribed && (
            <div className="grid grid-flow-row place-items-center border border-pink-100 gap-4 px-4 py-6 bg-pink-50 dark:bg-pink-600/10 rounded-2xl">
              <h4 className="font-medium text-base text-center">
                {isSubscribed
                  ? "Subscribed"
                  : "Subscribe to receive notifications"}
              </h4>
              <Button
                onClick={isSubscribed ? unsubscribeUser : subscribeUser}
                disabled={subscribing}
                variant={isSubscribed ? "destructive" : "default"}
                className="w-full py-6"
              >
                {subscribing ? (
                  <SunIcon width={18} className="animate-spin mr-2" />
                ) : (
                  <>
                    {isSubscribed ? (
                      <BellOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Bell className="mr-2 h-4 w-4" />
                    )}
                  </>
                )}

                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
          )}

          <div className={`${!isSubscribed && "opacity-50"}`}>
            <div className="w-full flex align-middle place-items-center gap-2 py-4">
              <Settings2 className="mr-1 h-5 w-5" />
              <h4 className="font-semibold text-base">Preferences</h4>
            </div>
            <div className="space-y-2 mt-2">
              {notificationTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <span>{type.label}</span>
                  <Switch
                    disabled={!isSubscribed}
                    checked={notificationPreferences[`${type.id}`] || false}
                    onCheckedChange={(enabled) =>
                      handlePreferenceChange(type.id, enabled)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          You can change these settings at any time.
        </CardFooter>

        {isSubscribed && (
          <div className="w-full grid place-items-center mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-red-500 py-6 mx-auto border-none shadow-none"
                >
                  <BellOff className="mr-2 h-4 w-4" />
                  Unsubscribe from notifications
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Heads Up!</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to stop receiving notifications?
                </AlertDialogDescription>
                <div className="flex md:flex-row flex-col md:items-center md:justify-end place-items-center justify-center">
                  <AlertDialogCancel asChild>
                    <Button
                      className="w-full py-6"
                      onClick={unsubscribeUser}
                      variant={"outline"}
                    >
                      Yes, Unsubscribe
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogCancel asChild>
                    <Button
                      className="w-full text-primary py-6"
                      variant={"default"}
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
