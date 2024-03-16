importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyApBfR-yMJJ6CKZB7mv-EVXSFsUXCSnkNA",
  authDomain: "greatexc.firebaseapp.com",
  databaseURL:
    "https://greatexc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "greatexc",
  storageBucket: "greatexc.appspot.com",
  messagingSenderId: "365786320575",
  appId: "1:365786320575:web:ce912ce81954c56e5e400a",
  measurementId: "G-2DN0PYT9EH",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  // Optionally, you can show a notification here
});
