// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
// export const messaging = getMessaging(app);
