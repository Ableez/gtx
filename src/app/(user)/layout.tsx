import { Suspense } from "react";
import Loading from "../loading";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <Suspense fallback={<Loading />}>{props.children}</Suspense>
    </div>
  );
};

export default UserLayout;
