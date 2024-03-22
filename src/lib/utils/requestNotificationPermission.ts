export const requestNotificationPermission = async () => {
  console.log("⚙️Requesting permission...");

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("✅NOTIFICATION PERMISSION GRANTED");

    return permission;
  } else if (permission === "denied") {
    console.log("❌User rejected Notifications");

    return "denied";
  } else {
    console.log(
      "❌UNABLE TO GET PERMISSION. PLEASE GRANT PERMISSION TO VIEW NOTIFICATIONS"
    );

    return "denied";
  }
};
