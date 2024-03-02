import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import Loading from "@/app/loading";
import { auth, db } from "@/lib/utils/firebase";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Cookies from "js-cookie";
import { FirebaseError } from "firebase/app";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  url: string | null;
};

export const SubmitButton = ({ setLoading }: { setLoading: Function }) => {
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setLoading(true);
    }
  }, [pending, setLoading]);

  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300"
    >
      Sign in
    </Button>
  );
};

const LoginForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const login = async (e: FormData) => {
    try {
      setLoading(true);
      const email = e.get("email");
      const password = e.get("password");

      if (!email || !password) {
        return {
          message: "All fields are required",
          success: false,
        };
      }
      await setPersistence(auth, browserLocalPersistence).then(async () => {
        await signInWithEmailAndPassword(
          auth,
          email.toString(),
          password.toString()
        ).then((user) => {
          Cookies.set("user", JSON.stringify(user.user.toJSON()));
          router.push(props.url || "/sell");
        });
      });
    } catch (error) {
      const err = error as FirebaseError;
      console.log(error);
      toast("Login failed", {
        description:
          err?.code === "auth/invalid-login-credentials"
            ? "Invalid login credentials"
            : err?.code === "auth/user-not-found"
            ? "User does not exists"
            : err?.code === "auth/wrong-password"
            ? "Wrong email or password"
            : err.code === "auth/network-request-failed"
            ? "Network request failed. Check your internet connection."
            : err.code === "auth/user-disabled"
            ? "This account has been disabled. Contact support for help."
            : err.code === "auth/too-many-requests"
            ? "You have tried too many times. Please try again later"
            : "Don't panic. Its us, Please try again.",
        dismissible: true,
        duration: 3500,
      });
      console.log(err.code);
      return {
        message:
          err?.code === "auth/invalid-login-credentials"
            ? err.message
            : err?.code === "auth/user-not-found"
            ? err.message
            : err?.code === "auth/wrong-password"
            ? err.message
            : err.code === "auth/network-request-failed"
            ? "Network request failed. Check your internet connection."
            : err.code === "auth/user-disabled"
            ? "This account has been disabled. Contact support for help."
            : err.code === "auth/too-many-requests"
            ? err.message
            : "Something went wrong. Try again",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <form
        action={async (e) => {
          login(e).then((res) => {
            setError(res?.message as string);
          });
        }}
        className="space-y-6"
      >
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
                {view ? <EyeIcon width={16} /> : <EyeSlashIcon width={16} />}
              </Button>
            </div>
          </div>
        </div>
        <SubmitButton setLoading={setLoading} />
      </form>
    </div>
  );
};

export default LoginForm;
