"use client";
import SellNavbar from "@/components/sellPage/SellNavbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface UserLayoutCtxProps {
  children: ReactNode;
}

const UserLayoutCtx: React.FC<UserLayoutCtxProps> = ({ children }) => {
  const pathName = usePathname();
  const hideNavbarRegex = /^\/chat\//;

  const isChatPage = hideNavbarRegex.test(pathName);
  const pageTitle = pathName.split("/")[1];

  return (
    <div className="max-w-screen-lg mx-auto">
      {!isChatPage && (
        <SellNavbar
          pathLen={pathName.split("/")[2]}
          pageTitle={pageTitle}
        />
      )}
      <div>{children}</div>
    </div>
  );
};

export default UserLayoutCtx;
