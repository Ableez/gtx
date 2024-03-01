import admin from "@/lib/utils/firebase-admin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid") as string;
    const userRecord = await admin.auth().getUser(uid);

    if (!userRecord) {
      return Response.json({
        user: null,
        isAdmin: false,
      });
    }

    const claims = userRecord.customClaims;

    if (claims?.admin) {
      return Response.json({
        user: JSON.stringify(userRecord),
        isAdmin: true,
      });
    } else {
      return Response.json({
        user: null,
        isAdmin: false,
      });
    }
  } catch (error) {
    console.error("VALIDATE ADMIN ERROR: ", error);
    return Response.json({
      user: null,
      isAdmin: false,
    });
  }
}
