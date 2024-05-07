"use client";

import Loading from "@/app/loading";
import SuccessCheckmark from "@/components/successMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/utils/firebase";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type Props = {};

const SubmitButton = ({ setLoading }: { setLoading: Function }) => {
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [pending, setLoading]);

  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300 mt-4"
    >
      Reset
    </Button>
  );
};

const IforgotReset = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = async (e: FormData) => {
    const email = e.get("email");

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email?.toString() as string);

      toast("Successful!", {
        description: `Check ${email} for next steps.`,
        dismissible: true,
        duration: 3500,
      });
      setSent(true);
    } catch (error) {
      const err = error as FirebaseError;
      toast("Failed!", {
        description:
          err?.code === "auth/invalid-email"
            ? "Invalid email address. Please try again."
            : err?.code === "auth/user-not-found"
            ? "User not found"
            : err.code === "auth/too-many-requests"
            ? "You have probably tried this too many. please try again later"
            : err.code === "auth/network-request-failed"
            ? "You seem to be offline. check your internet connection."
            : "Something went wrong. Try again",
        dismissible: true,
        duration: 3500,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-start p-2 py-12 lg:px-8">
      {loading && <Loading />}

      <Link href={"/"} className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
          <Image
            width={38}
            height={38}
            src={"/greatexc.svg"}
            alt="Great Exchange"
          />
          <h4 className="text-xl font-bold">Greatexc</h4>
        </div>
      </Link>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-black dark:bg-opacity-70 bg-white p-3 rounded-2xl">
        {!sent ? (
          <>
            <h2 className="mb-2 text-center text-xl font-bold leading-9 tracking-tight text-neutral-900 dark:text-white">
              Reset your password
            </h2>
            <p className="text-sm pb-4 text-center text-opacity-60 text-black dark:text-white">
              Enter your email address that you use with your account to
              continue.
            </p>
            <form action={reset}>
              <div>
                <div className="mt-2">
                  <Input
                    disabled={loading}
                    aria-disabled={loading}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    required
                    className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <SubmitButton setLoading={setLoading} />
            </form>
            <p className="mt-10 text-center text-sm text-neutral-500">
              Create a new account instead?{" "}
              <Link
                href="/register"
                className="font-semibold leading-6 text-primary hover:text-primary"
              >
                Sign Up
              </Link>
            </p>{" "}
          </>
        ) : (
          <div className="grid grid-flow-row gap-4 py-4">
            <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-neutral-900 dark:text-white">
              Sent
            </h2>
            <SuccessCheckmark />

            <p className="text-sm text-center text-opacity-60 text-black dark:text-white mb-4">
              A Recovery link has been sent to your email. click it to reset
              your password.
            </p>
            <div>
              <Link
                href="/login"
                className="flex w-full justify-center rounded-md bg-primary px-3 p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300"
              >
                Continue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IforgotReset;
