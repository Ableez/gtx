"use server";

import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../../gtx-service-account.json";
// Replace with your service account key

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL:
    "DB-URL",
});
export default adminApp;



// https://greatexc-default-rtdb.europe-west1.firebasedatabase.ap