import { cookies } from "next/headers";

export const getUserCookie = async () => {
  const user = cookies().get("user")?.value;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
};
