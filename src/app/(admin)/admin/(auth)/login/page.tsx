import AdminLoginForm from "@/components/admin/AdminLoginForm";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const AdminLogin = (props: Props) => {
  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-start p-4 py-12 lg:px-8">
        <Link href={"/"} className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
            <Image
              width={38}
              height={38}
              src={"/greatexc.svg"}
              alt="Great Exchange"
            />
            <h4 className="text-xl font-bold">Admin</h4>
          </div>
        </Link>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-neutral-700 dark:bg-opacity-70 bg-white p-4 rounded-2xl">
          <h2 className="mb-10 text-center text-xl font-bold leading-9 tracking-tight text-neutral-900 dark:text-white">
            Sign in to your account
          </h2>
          <AdminLoginForm />
        </div>
        <p className="mt-10 text-center text-sm text-neutral-500 dark:text-white">
          Don&apos;t have an account?{" "}
          <Link
            href="/admin/register"
            className="font-semibold leading-6 text-primary hover:text-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default AdminLogin;
