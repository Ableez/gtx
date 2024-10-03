"use client";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/utils/actions/signinwithgoogle";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const AdminLogin = (props: Props) => {
  return (
    <>
      <div className="grid grid-flow-row gap-6 py-6 px-2 max-w-sm mx-auto">
        <div className="flex align-middle place-items-center justify-between px-4">
          <Link href={"/"} className="py-2">
            <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
              <Image
                width={32}
                height={32}
                src={"/greatexc.svg"}
                alt="Great Exchange"
              />
              <h4 className="text-xl font-semibold text-primary">
                Great Exchange
              </h4>
            </div>
          </Link>
          <h4 className="text-xl font-bold text-center">Sign In</h4>
        </div>

        {/* enable admin sign in with google in #NEXT_UPDATE */}
        {/* <div className="gap-4 px-4 mx-auto w-full">
          <Button
            onClick={() => {
              signInWithGoogle();
            }}
            className="p-6 flex align-middle justify-center gap-3 place-items-center w-full"
            variant={"outline"}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </div> */}

        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-neutral-900 p-4 rounded-2xl">
          <AdminLoginForm />

          <p className="mt-10 text-center text-sm text-neutral-500">
            New here?{" "}
            <Link
              href="/admin/register"
              className="font-semibold leading-6 text-primary hover:text-primary"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
