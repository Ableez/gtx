"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type Props = {
  children: ReactNode;
};
const AdminLayout = (props: Props) => {
  const [fpHash, setFpHash] = useState("");

  const router = useRouter();

  useEffect(() => {
    const setFp = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/validate-visitor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );

      const resp = (await response.json()) as {
        isAdmin: boolean;
        login: boolean;
      };

      if (resp.login) {
        return router.push("/login");
      }

      if (resp.isAdmin) {
        setFpHash("Authorized");
      } else {
        setFpHash("Unauthorized");
        return router.push("/redirect");
      }
    };

    setFp();
  }, [router]);

  if (fpHash === "") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (fpHash === "Authorized") {
    return <>{props.children}</>;
  }

  if (fpHash === "Unauthorized") {
    return (
      <div className="text-red-500 h-screen w-screen flex flex-col items-center justify-center text-lg font-bold">
        🔐
      </div>
    );
  }

  return <>❌Error State</>;
};

export default AdminLayout;
