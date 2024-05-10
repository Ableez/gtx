"use client";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/loginForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import { signInWithGoogle } from "@/lib/utils/actions/signinwithgoogle";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

type Props = {};

const LoginPage = (props: Props) => {
  const params = useSearchParams();
  const router = useRouter();
  const urlRef = params.get("referrer");

  return (
    <>
      <div className="grid grid-flow-row gap-6 py-6 px-2 max-w-sm mx-auto">
        <div className="flex align-middle place-items-center justify-between px-4">
          <Button
            variant={"outline"}
            className="text-black dark:text-white"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowRightIcon />
          </Button>
          <Link href={"/"} className="py-2">
            <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
              <Image
                width={32}
                height={32}
                src={"/greatexc.svg"}
                alt="Great Exchange"
              />
              <h4 className="text-xl font-semibold text-primary">Greatex</h4>
            </div>
          </Link>
          <h4 className="text-xl font-bold text-center">Sign In</h4>
        </div>

        <div className="gap-4 px-4 mx-auto w-full">
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
        </div>

        <h4 className="w-fit mx-auto">Or</h4>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-black p-4 rounded-2xl">
          <LoginForm url={urlRef} />

          <p className="mt-10 text-center text-sm text-neutral-500">
            New here?{" "}
            <Link
              href="/register"
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

export default LoginPage;
