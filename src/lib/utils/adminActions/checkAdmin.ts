"use server";

import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { cookies } from "next/headers";

export const checkIsAdmin = async () => {
  try {
    const u = cookies().get("user")?.value;
    if (!u) {
      return {
        isAdmin: false,
        message: "User does not exists in cookies",
        user: null,
      };
    }

    const user = JSON.parse(u) as UserRecord;

    const checkUser = await fetch(
      `${process.env.BASE_URL}/api/admin/validate?uid=${user.uid}`,
      {
        method: "GET",
      }
    );

    const response = await checkUser.json();

    if (response.isAdmin) {
      return {
        isAdmin: true,
        message: "User is admin",
        user: response.user,
      };
    }
  } catch (error) {
    console.log("CHECK ADMIN: ", error);
    return {
      isAdmin: false,
      message: "Internal error occured!",
      user: null,
    };
  }
};
