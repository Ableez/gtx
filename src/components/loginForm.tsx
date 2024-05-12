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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { postToast } from "./postToast";

type Props = {
  url: string | null;
};

export const SubmitButton = ({ setLoading }: { setLoading: Function }) => {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setLoading(true);
    }
  }, [pending, setLoading]);

  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-medium leading-6 text-white shadow-sm hover:bg-primary  disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300 mt-2"
    >
      Continue
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

  // This function handles the login process
  const login = async (e: FormData) => {
    try {
      // Start loading
      setLoading(true);

      // Get email and password from the form data
      const email = e.get("email");
      const password = e.get("password");

      // Check if email and password are provided
      if (!email || !password) {
        return {
          message: "All fields are required",
          success: false,
        };
      }

      // Set persistence and sign in with email and password
      await setPersistence(auth, browserLocalPersistence);
      const _u = await signInWithEmailAndPassword(
        auth,
        email.toString(),
        password.toString()
      );

      // Get the user document reference
      const userRef = doc(db, "Users", _u.user.uid);

      // Get the user document
      const user = await getDoc(userRef);

      // If the user document does not exist, create a new one
      if (!user.exists()) {
        // Prepare user data
        const userData = {
          displayName: _u.user.displayName,
          email: _u.user.email,
          emailVerified: _u.user.emailVerified,
          phoneNumber: _u.user.phoneNumber,
          photoURL: _u.user.photoURL,
          uid: _u.user.uid,
          metadata: { ..._u.user.metadata },
          role: "user",
          conversations: [],
          cardChoices: [],
          transactions: [],
        };

        // Save user data to db
        await setDoc(doc(db, "Users", user.id), userData);

        // Save the user to cookies
        Cookies.set("user", JSON.stringify(userData));
      } else {
        // If the user document exists, save it to cookies
        Cookies.set("user", JSON.stringify(user.data()));
      }

      // Redirect to the referred url or to "/sell"
      window.location.href = "/sell";
      router.refresh();
      router.push(props.url || "/sell");
    } catch (error) {
      // Handle errors
      const err = error as FirebaseError;

      console.log(error);

      // Display a toast message based on the error code
      toast(getErrorMessage(err), {
        dismissible: true,
        duration: 10000,
      });

      console.log(err.code);

      // Return an error message based on the error code
      return {
        message: getErrorMessage(err),
      };
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // This function returns an error message based on the error code
  const getErrorMessage = (err: FirebaseError) => {
    switch (err?.code) {
      case "auth/invalid-login-credentials":
        return "Invalid login credentials";
      case "auth/user-not-found":
        return "User does not exists";
      case "auth/wrong-password":
        return "Wrong email or password";
      case "auth/network-request-failed":
        return "No internet connection";
      case "auth/user-disabled":
        return "This account has been disabled. Contact support for help.";
      case "auth/too-many-requests":
        return "You have tried too many times. Please try again later";
      default:
        return "An error occured. Don't panic, Its us, Please try again.";
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
            className="block text-sm font-medium leading-6 text-neutral-600 dark:text-neutral-400"
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
              className="block w-full rounded-md border-0 py-6 text-base shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-neutral-600 dark:text-neutral-400"
            >
              Password
            </Label>
            <div className="text-sm">
              <Link
                href="/iforgot"
                className="font-medium text-primary hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex align-middle place-items-center justify-between gap-0.5">
              <Input
                disabled={loading}
                aria-disabled={loading}
                id="password"
                name="password"
                type={view ? "text" : "password"}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-6 text-base shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary sm:text-sm sm:leading-6"
                required
              />
              <Button
                onClick={() => setView((prev) => !prev)}
                type="button"
                variant={"ghost"}
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
