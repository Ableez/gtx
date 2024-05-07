"use client";

import React, { useEffect } from "react";

type Props = {};

const RequestNotification = (props: Props) => {
  useEffect(() => {
    function notifyMe() {
      if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support notification");
      }

      //   if (Notification.permission === "granted") {
      //     const notification = new Notification("Message", {
      //       icon: "/greatexc.svg",
      //       body: "This is just to say hi to you",
      //     });
      //     notification.addEventListener("click", () => {
      //       // …
      //       console.log("user clicked it");
      //       notification.close();
      //     });
      //   }

      if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    notifyMe();
  }, []);

  return null;
};

export default RequestNotification;
