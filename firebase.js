// Check if the environment supports Firebase Messaging
if (
  navigator &&
  window &&
  "serviceWorker" in navigator &&
  "PushManager" in window
) {
  // Create firebase fcm service worker
  importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
  importScripts(
    "https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js"
  );

  // Initialize the Firebase app in the service worker by passing the generated config
  var firebaseConfig = {
    apiKey: "AIzaSyBaqs5rPeY_5Mol9nq8MOzLhZ5QsdEwL2E",
    authDomain: "great-exchange.firebaseapp.com",
    projectId: "great-exchange",
    storageBucket: "great-exchange.appspot.com",
    messagingSenderId: "443106951382",
    appId: "1:443106951382:web:4cb7f93ab5c93d09dd8977",
  };

  firebase.initializeApp(firebaseConfig);

  // Retrieve an instance of Firebase Messaging so that it can handle background messages.
  const messaging = firebase.messaging();
  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
      body: "Background Message body.",
      icon: "/greatexc.svg",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
