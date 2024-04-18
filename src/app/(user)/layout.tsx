import AuthProvider from "@/lib/context/AuthProvider";
import { Suspense } from "react";
import Loading from "../loading";
import { init } from "@/lib/utils/idb";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      {/* <AuthProvider> */}
      <Suspense fallback={<Loading />}>{props.children}</Suspense>
      {/* </AuthProvider> */}
    </div>
  );
};

export default UserLayout;
