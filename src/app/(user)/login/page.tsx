"use client";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/loginForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import { signInWithGoogle } from "@/lib/utils/actions/signinwithgoogle";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type Props = {};

const LoginPage = (props: Props) => {
  const params = useSearchParams();
  const router = useRouter();
  const urlRef = params.get("referrer");

  return (
    <>
      <div className="grid grid-flow-row gap-6 py-6 px-2 max-w-sm mx-auto">
        <div className="flex align-middle place-items-center justify-between">
          <Button
            variant={"outline"}
            size={"icon"}
            className="text-black dark:text-neutral-400 aspect-square"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeftIcon width={"18"} />
          </Button>
          <h4 className="text-base font-bold text-center">Sign In</h4>
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
          <LoginForm url={urlRef} isAdmin={true} />

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
