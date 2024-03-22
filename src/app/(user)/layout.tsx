
import AuthProvider from "@/lib/context/AuthProvider";
import { Suspense } from "react";
import Loading from "../loading";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <AuthProvider>
        <Suspense fallback={<Loading />}>{props.children}</Suspense>
      </AuthProvider>
    </div>
  );
};

export default UserLayout;
