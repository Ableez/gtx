"use server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL
    : "http://localhost:3000";

export const sendImageA = async (formData: FormData) => {
  const uc = cookies().get("user")?.value;

  if (!uc) {
    return { success: false, message: "User not found" };
  }

  const user = JSON.parse(uc);

  try {
    const chatId = formData.get("chatId")?.toString();
    const metadata = JSON.parse(
      formData.get("metadata")?.toString() ?? "{}"
    ) as {
      type: string;
    };
    const image = formData.get("image") as unknown as File;

    const url = `/chatImages/${chatId}/greatexchange.co__${randomUUID()}__${
      image.name
    }__${user.uid}`;

    const res = await fetch(`${baseUrl}/api/sendimage`, {
      body: JSON.stringify({ image, metadata, url, uid: user.uid }),
      method: "POST",
    }).then((e) => e.json());

    console.log(res);

    return res;
  } catch (error) {
    console.error(error);

    return {
      message: "An error occured",
      success: false,
    };
  }
};
