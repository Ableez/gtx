import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault(),
    databaseURL:
      "https://greatexc-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

export default admin
