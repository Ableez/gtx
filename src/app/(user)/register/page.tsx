"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/utils/firebase";
import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { postToast } from "@/components/postToast";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { SubmitButton } from "@/components/loginForm";
import Loading from "@/app/loading";

type Props = {};

const LoginPage = (props: Props) => {
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

      const res = await data.json();

      if (res.login) {
        Cookies.set("user", JSON.stringify(res.user), {
          expires: 1000 * 60 * 60 * 24 * 7,
        });
        postToast("Success", {
          description: "Account created successfully",
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
      <div className="flex min-h-[100dvh] flex-1 flex-col justify-center p-4 pt-6 lg:px-8">
        <Link href={"/"} className="sm:mx-auto sm:w-full sm:max-w-sm py-4">
          <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
            <Image
              width={38}
              height={38}
              src={"/greatexc.svg"}
              alt="Great Exchange"
            />
            <h4 className="text-xl font-bold">Sign up</h4>
          </div>
        </Link>

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
                    className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
                  >
                    Password
                  </Label>
                  <div className="text-sm">
                    <Link
                      href="/iforgot"
                      className="font-semibold text-primary hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex align-middle place-items-center justify-between w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-2">
                    <Input
                      disabled={loading}
                      aria-disabled={loading}
                      id="password"
                      name="password"
                      type={view ? "text" : "password"}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white ring-0 placeholder:text-neutral-400 focus:ring-0 focus-visible:ring-0 sm:text-sm sm:leading-6"
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
            Already a member?{" "}
            <Link
              href="/admin/login"
              className="font-semibold leading-6 text-primary hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
