"use client";
import DisplayChats from "@/components/chat/display-chats";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const UserChats = () => {
  const uc = Cookies.get("user");
  const cachedUser = JSON.parse(uc ?? "{}");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!uc) {
      return redirect("/sell");
    }
    if (cachedUser.role === "admin") {
      setIsAdmin(true);
    }
  }, [cachedUser.role, uc]);

  return (
    <div>
      <DisplayChats isAdmin={isAdmin} />
    </div>
  );
};

export default UserChats;
