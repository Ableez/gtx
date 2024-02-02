"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/utils/firebase";
import Cookies from "js-cookie";
import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { BaseSyntheticEvent, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

type Props = {};

const AdminLogin = (props: Props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleInput = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    const name = e.target.name;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: val,
      };
    });
  };

  const signInCredentials = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        return signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
          .then(async (user) => {
            const docRef = doc(db, "Users", user.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().role === "admin") {
              Cookies.set("role", "admin", { expires: 7 * 24 });
              user.user.reload();
              Cookies.set("user", JSON.stringify(user.user.toJSON()));
              router.refresh()
              router.push("/admin");
              setLoading(false);
            }
          })
          .catch((e) => {
            setError(e);
            setLoading(false);
          });
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  };

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
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => handleInput(e)}
                  required
                  className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-400"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-primary"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => handleInput(e)}
                  required
                  className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <p className="text-xs text-opacity-40">{error.toString()}</p>
            <div>
              <Button
                onClick={(e) => signInCredentials(e)}
                disabled={
                  loading ||
                  formData.email === "" ||
                  formData.password === "" ||
                  false
                }
                className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300"
              >
                {loading ? (
                  <>
                    <Loader /> Signing In
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
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
