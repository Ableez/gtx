import { adminDB } from "@/lib/utils/firebase-admin";

export async function POST(req: Request) {
  const { visitorId } = await req.json();

  const doc = await adminDB.collection("allowedAdmins").doc(visitorId).get();

  if (!doc.exists) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (doc.data()?.disabled) {
  return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Authorized", { status: 200 });
}
