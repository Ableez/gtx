import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: "4aaacc46-e1d8-4e5c-a840-75a26f4278ac",
    safari_web_id: "web.onesignal.auto.1592f4e8-7629-48b3-b916-fa35b5011e11",
    notifyButton: {
      enable: true,
    },
  });
  OneSignal.Slidedown.promptPush();
}
