"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { postToast } from "@/components/postToast";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SubmitButton } from "@/components/loginForm";
import Loading from "@/app/loading";
import GoogleIcon from "@/components/icons/google";
import { signInWithGoogle } from "@/lib/utils/actions/signinwithgoogle";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/utils/firebase";

type Props = {};

const RegisterPage = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);
  const router = useRouter();

  const signup = async (e: FormData) => {
    try {
      setLoading(true);

      const password = e.get("password")?.toString();
      const email = e.get("email")?.toString();
      const username = e.get("username")?.toString();

      if (!password || !email || !username) {
        postToast("Attention!", { description: "All fields are required." });
        return;
      }

      const data = await fetch("/api/user/signup", {
        method: "post",
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
        }),
      });

      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(
        auth,
        email.toString(),
        password.toString()
      );

      const res = await data.json();

      if (res.login) {
        Cookies.set("user", JSON.stringify(res.user), {
          expires: 1000 * 60 * 60 * 24 * 7,
        });
        postToast("Success", {
          description: "Account created successfully.",
        });
        router.push("/sell");
      }

      if (!res.login) {
        postToast("Error", {
          description:
            res?.message === "auth/invalid-login-credentials"
              ? "Invalid login credential"
              : res?.message === "auth/user-not-found"
              ? "User not found"
              : res?.message === "auth/email-already-in-use"
              ? "Email already in use"
              : res?.message === "auth/wrong-password"
              ? res?.message
              : res?.message === "auth/network-request-failed"
              ? "You seem to be offline. check your internet connection."
              : res?.message === "auth/too-many-requests"
              ? res?.message
              : "Something went wrong. Try again",
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error during account creation:", error);
      postToast("Error", {
        description: "An unknow error occured. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
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
              <h4 className="text-xl font-semibold text-primary">Greatex</h4>
            </div>
          </Link>
          <h4 className="text-xl font-bold text-center">Sign Up</h4>
        </div>

        <div className="gap-4 px-4 mx-auto max-w-sm w-full">
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

        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-neutral-800 p-4 rounded-2xl">
          <div>
            <form action={signup} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
                >
                  Username
                </label>
                <div className="mt-2">
                  <Input
                    disabled={loading}
                    aria-disabled={loading}
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <Input
                    disabled={loading}
                    aria-disabled={loading}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
                >
                  Password
                </Label>
                <div className="mt-2">
                  <div className="flex align-middle place-items-center justify-between gap-0.5">
                    <Input
                      disabled={loading}
                      aria-disabled={loading}
                      id="password"
                      name="password"
                      type={view ? "text" : "password"}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm sm:leading-6"
                      required
                    />
                    <Button
                      onClick={() => setView((prev) => !prev)}
                      type="button"
                      variant={"ghost"}
                      className="hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-300"
                      size={"icon"}
                    >
                      {view ? (
                        <EyeIcon width={16} />
                      ) : (
                        <EyeSlashIcon width={16} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <SubmitButton setLoading={setLoading} />
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-neutral-500 dark:text-white">
            Have an account?{" "}
            <Link
              href="/login"
              className="font-medium leading-6 text-primary hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
