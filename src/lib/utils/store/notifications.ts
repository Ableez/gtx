import { create } from "zustand";

type State = {
  isSubscribed: boolean;
  subscriptionData: PushSubscription | null;
  notificationPermission: NotificationPermission | null;
};

type Actions = {
  updateSubscriptionStatus: (val: boolean) => void;
  updateSubscriptionData: (data: PushSubscription | null) => void;
  updateNotificationPermission: (permission: NotificationPermission) => void;
};

export const useNotificationSubscription = create<State & Actions>((set) => ({
  isSubscribed: false,
  subscriptionData: null,
  notificationPermission: null,
  updateSubscriptionStatus(val) {
    set({
      isSubscribed: val,
    });
  },
  updateSubscriptionData: (data: PushSubscription | null) => {
    set({ subscriptionData: data });
  },
  updateNotificationPermission(permission) {
    set({ notificationPermission: permission });
  },
}));
