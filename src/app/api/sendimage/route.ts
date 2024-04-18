import { storage } from "@/lib/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { sendUserMessage } from "@/lib/utils/actions/userChat";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";

type MediaContent = {
  caption?: string;
  url: string;
  metadata: {
    media_name: string;
    media_type?: string;
    media_size: number;
  };
};

type Message = {
  data: {
    timeStamp: number;
  };
  id: string;
  mediaContent?: MediaContent;
  media?: boolean;
};
type ReqType = {
  image: string;
  metadata: any;
  url: string;
  uid: string;
  chatId: string;
  caption: string;
  owns: string;
  recipient: {
    username: string;
    uid: string;
    email: string;
    photoUrl: string;
  };
};

export const POST = async (req: NextRequest) => {
  try {
    const {
      image,
      metadata,
      url,
      uid,
      chatId,
      caption,
      owns,
      recipient,
    }: ReqType = await req.json();

    const base64Data = image.split(";base64,").pop();
    if (!base64Data) {
      throw new Error("Invalid base64 string");
    }

    const toBlob = Buffer.from(base64Data, "base64");

    const storageRef = ref(storage, url);

    const uploadTask = await uploadBytes(storageRef, toBlob, {
      contentType: metadata.type,
    });

    const mediaurl = await getDownloadURL(uploadTask.ref);

    if (owns === "admin") {
      await sendAdminMessage(
        {
          timeStamp: new Date(),
        },
        chatId,
        recipient,
        undefined,
        {
          caption,
          url: mediaurl,
          metadata: {
            media_name: metadata.name,
            media_type: metadata.type,
            media_size: metadata.size,
          },
        },
        true
      );
    } else {
      await sendUserMessage(
        {
          timeStamp: new Date(),
        },
        chatId,
        undefined,
        {
          caption,
          url: mediaurl,
          metadata: {
            media_name: metadata.name,
            media_type: metadata.type,
            media_size: metadata.size,
          },
        },
        true
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      mediaUrl: mediaurl,
    });
  } catch (error) {
    console.error("ERROR @ /api/sendimage __ POST", error);

    return NextResponse.json({
      success: false,
      message: "An error occured while uploading image",
      mediaUrl: null,
    });
  }
};
