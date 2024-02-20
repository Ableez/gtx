"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/utils/firebase";
import Cookies from "js-cookie";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { checkIsAdmin } from "@/lib/utils/adminActions/checkAdmin";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import Loading from "@/app/loading";
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";
import { postToast } from "../postToast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import { User } from "../../../types";

const SubmitButton = ({ setLoading }: { setLoading: Function }) => {
  const { pending, data } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300"
    >
      {pending && <Loading />}
      Sign in
    </Button>
  );
};

type Props = {};

const AdminLoginForm = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);

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
        return signInWithEmailAndPassword(
          auth,
          email.toString(),
          password.toString()
        ).then(async (user) => {
          const userRef = doc(db, "Users", user.user.uid);
          const checkedUser = (await getDoc(userRef)).data() as User;

          if (!checkedUser) {
            await signOut(auth);
            router.replace("/admin/login");
            return;
          }

          if (checkedUser && checkedUser.role !== "admin") {
            await signOut(auth);
            router.replace("/admin/login");
            return {
              message: "Unauthorized, you are not an admin.",
              success: false,
            };
          }

          if (checkedUser.role === "admin") {
            Cookies.set("user", JSON.stringify(user.user.toJSON()));
            router.push("/admin");
          }
        });
      });
    } catch (error) {
      const err = error as FirebaseError;
      return {
        message:
          err?.code === "auth/invalid-login-credentials"
            ? "Wrong password or email"
            : err?.code === "auth/user-not-found"
            ? "User does not exists"
            : err?.code === "auth/wrong-password"
            ? "Wrong password or email."
            : err.code === "auth/network-request-failed"
            ? "Poor connection. Network request failed."
            : err.code === "auth/too-many-requests"
            ? "Too many login attempts. Try again in 60s."
            : "Something went wrong. Try again",
        success: false,
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
            if (res?.message) {
              postToast("Error", { description: res?.message });
            }

            if (res?.message === "Too many login attempts") {
              alert("Too many login attempts. Try again after 60s.");
            }
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
              className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset dark:focus:ring-primary sm:text-sm sm:leading-6"
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
            <div className="flex align-middle place-items-center justify-between w-full rounded-md border border-input bg-transparent text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-within:ring-1 focus-within:ring-primary disabled:cursor-not-allowed disabled:opacity-50 pr-2">
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

export default AdminLoginForm;
