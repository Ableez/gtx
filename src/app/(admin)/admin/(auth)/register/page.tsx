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
import { useRouter } from "next/navigation";
import React, { BaseSyntheticEvent, useState } from "react";
import Cookies from "js-cookie";

type Props = {};

const LoginPage = (props: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const signUpCredentials = async () => {
    setLoading(true);
    setError("");
    try {
      // Set browser local persistence
      await setPersistence(auth, browserLocalPersistence);

      // Create account
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      Cookies.set("uid", user.uid);

      // Update user profile first
      await updateProfile(auth.currentUser as User, {
        displayName: formData.username,
      });

      // userData to be saved to db
      const userData = {
        email: user.email,
        username: user.displayName, // The display name should now be available
        imageUrl: user.photoURL,
        id: user.uid,
        role: "admin",
      };

      // Save user data to db
      await setDoc(doc(db, "Users", user.uid), userData);

      router.push("/admin");
      setLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error during account creation:", error);
      setLoading(false);
      setError(error as string);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center p-4 py-12 lg:px-8">
        <Link href={"/"} className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex align-middle place-items-center w-fit gap-2 mx-auto">
            <Image
              width={38}
              height={38}
              src={"greatexc.svg"}
              alt="Great Exchange"
            />
            <h4 className="text-xl font-bold">Admin</h4>
          </div>
        </Link>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-neutral-800 p-4 rounded-2xl">
          <h2 className="mb-10 text-center text-xl font-bold leading-9 tracking-tight text-neutral-900 dark:text-white">
            Create an account
          </h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <Input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  onChange={(e) => handleInput(e)}
                  required
                  className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 dark:text-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
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
                  className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 dark:text-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => handleInput(e)}
                  required
                  className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 dark:text-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <p className="text-xs text-opacity-40">{error.toString()}</p>
            <div>
              <Button
                disabled={
                  loading ||
                  formData.email === "" ||
                  formData.username === "" ||
                  formData.password === ""
                }
                onClick={() => signUpCredentials()}
                type="button"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-50 gap-3"
              >
                {loading ? (
                  <>
                    <Loader /> Signing Up
                  </>
                ) : (
                  <>Sign Up</>
                )}
              </Button>
            </div>
          </form>

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
