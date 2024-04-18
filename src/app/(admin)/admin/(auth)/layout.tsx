import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const AdminAuthLayout = (props: Props) => {
  return (
    <>
      <div className="text-xs mt-4 p-1.5 text-center">
        Not an admin?{" "}
        <Link href={"/login"} className="underline font-semibold">
          click here
        </Link>
      </div>
      {props.children}
    </>
  );
};

export default AdminAuthLayout;
