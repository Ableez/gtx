import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECTID,
      privateKey: process.env.FIREBASE_PRIVATEKEY,
      clientEmail: process.env.FIREBASE_CLIENTEMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASEURL,
  });
}

export default admin;
