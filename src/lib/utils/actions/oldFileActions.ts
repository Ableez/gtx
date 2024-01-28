"use server";

import {
  getDownloadURL,
  ref,
  uploadString,
  UploadResult,
} from "firebase/storage";
import { storage } from "../firebase";
import { sendUserMessage } from "./userChat";
import { cookies } from "next/headers";
import { User } from "firebase/auth";

interface ImageBuffer {
  name: string;
  type: string;
  data: string;
}

interface SendImageResponse {
  message: string;
  done: boolean;
  failed: boolean;
}

export const sendImage = async (
  id: string,
  data: {
    imageBuffer: ImageBuffer;
    message: string;
  },
  e?: FormData
): Promise<SendImageResponse | undefined> => {
  try {
    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    const { imageBuffer, message } = data;
    const storageRef = ref(
      storage,
      `/cardImages/www.greatexchange.co---${user?.uid}---${id}---${imageBuffer.name}`
    );

    const snap = (await uploadString(
      storageRef,
      imageBuffer.data,
      "data_url"
    ).catch((err) => {
      console.log("ERROR @ SNAP", err);
    })) as UploadResult;

    const url = await getDownloadURL(storageRef);

    const userMessageData = {
      timeStamp: new Date(),
    };

    const userMessagePayload = {
      caption: message,
      url,
      metadata: {
        media_name: snap.metadata.name,
        media_type: snap.metadata.contentType as string,
        media_size: snap.metadata.size as number,
      },
    };

    const res = await sendUserMessage(
      userMessageData,
      id,
      undefined,
      userMessagePayload,
      true
    ).catch((err) => {
      console.error("ERROR AT SERVER ACTION", err);
    });

    if (res?.success) {
      return {
        message: "Image sent",
        done: true,
        failed: false,
      };
    } else {
      console.error("ERROR AT SERVER ACTION", res?.error);
      return {
        message: res?.error || "Failed to send image",
        done: false,
        failed: true,
      };
    }
  } catch (error) {
    console.error("ERROR AT SERVER ACTION", error);
    return {
      message: (error as string) || "An unexpected error occurred",
      done: false,
      failed: true,
    };
  }
};
