"use client";

import { useEffect } from "react";
// import runOneSignal from "./Onesignal";

type Props = {};

const RequestNotification = (props: Props) => {
  // Implement your logic here
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub == undefined) {
            if (reg) {
              reg.pushManager
                .subscribe({
                  userVisibleOnly: true,
                })
                .then((sub) => {
                  console.log("sub", sub.toJSON());
                });
            }
          } else {
            console.log("sub", sub.toJSON());
          }
        });
      });
    }
  }, []);

  return null;
};

export default RequestNotification;
