importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyApBfR-yMJJ6CKZB7mv-EVXSFsUXCSnkNA",
  authDomain: "greatexc.firebaseapp.com",
  databaseURL:
    "https://greatexc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "greatexc",
  storageBucket: "greatexc.appspot.com",
  messagingSenderId: "365786320575",
  appId: "1:365786320575:web:ce912ce81954c56e5e400a",
  measurementId: "G-2DN0PYT9EH",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
