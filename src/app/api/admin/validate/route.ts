import admin from "@/lib/utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const getParams = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams.get("uid") as string;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(params);
    }, 1000)
  );
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("💳 Validating user...");

  const uid = (await getParams(request)) as string;

  try {
    if (!uid) {
      throw Error("UID parameter is missing");
    }

    const userRecord = await admin.auth().getUser(uid);

    if (!userRecord) {
      return NextResponse.json({
        user: null,
        isAdmin: false,
      });
    }

    const claims = userRecord.customClaims;

    if (claims?.admin) {
      return NextResponse.json({
        user: JSON.stringify(userRecord),
        isAdmin: true,
      });
    } else {
      return NextResponse.json({
        user: null,
        isAdmin: false,
      });
    }
  } catch (error) {
    console.error("VALIDATE ADMIN ERROR: ", error);
    return NextResponse.json({
      user: null,
      isAdmin: false,
    });
  }
}
