import { cookies } from "next/headers";

export const getUserCookie = async () => {
  const user = cookies().get("user")?.value;
  if (user) {
    return user;
  } else {
    return null;
  }
};

