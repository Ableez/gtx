import { db } from "@/lib/utils/firebase";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export const GET = async (req: NextRequest) => {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 404 });
  }

  const chatId = req.nextUrl.searchParams.get("id");

  try {
    const chatDocRef = doc(db, "Messages", chatId as string);
    const chatDocSnap = await getDoc(chatDocRef);

    if (chatDocSnap.exists()) {
      const chatData = chatDocSnap.data() as Message;
      return NextResponse.json({ ...chatData }, { status: 200 });
    } else {
      console.error("Error: Chat document not found");
      return NextResponse.json(
        { error: "Chat document not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return NextResponse.json(
      { error: "Error fetching chat data" },
      { status: 500 }
    );
  }
};
