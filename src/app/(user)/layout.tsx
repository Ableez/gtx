import { Suspense } from "react";
import Loading from "../loading";
import Link from "next/link";
import { checkRole } from "@/lib/utils/role";

type Props = {
  children: React.ReactNode;
};

const UserLayout = async (props: Props) => {
  const isAdmin = checkRole("admin");

  return (
    <div className="max-w-screen-lg mx-auto">
      {isAdmin ? (
        <div className="bg-neutral-800 grid place-items-center justify-center gap-4 grid-flow-col p-2 text-sm">
          You an admin
          <Link className="text-primary font-bold" href="/admin">
            Go to dashboard
          </Link>
        </div>
      ) : null}
      <Suspense fallback={<Loading />}>{props.children}</Suspense>
    </div>
  );
};

export default UserLayout;
