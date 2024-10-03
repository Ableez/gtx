"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import Loading from "@/app/loading";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { postToast } from "./postToast";
import { loginUser } from "@/lib/utils/actions/login-action";

type Props = {
  url?: string | null;
};

export const SubmitButton = ({
  setLoading,
}: {
  setLoading?: (t: boolean) => void;
}) => {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (typeof setLoading !== "undefined") {
      if (pending) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, [pending, setLoading]);

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-medium leading-6 text-white shadow-sm hover:bg-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300 mt-2"
    >
      {pending && <Loading />}
      Sign in
    </Button>
  );
};

const UnifiedLoginForm = ({ url = null }: Props) => {
  const [view, setView] = useState(false);
  const router = useRouter();

  return (
    <form
      action={async (formData: FormData) => {
        const result = await loginUser(formData);
        if (result.success) {
          router.push(result.isAdmin ? "/admin" : url || "/sell");
        } else {
          // Handle error (e.g., show toast)

          postToast("Error", { description: result.message });
          console.error(result.message);
        }
      }}
      className="space-y-6"
    >
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-neutral-600 dark:text-neutral-400"
        >
          Email address
        </Label>
        <div className="mt-2">
          <Input
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
      <SubmitButton />
    </form>
  );
};

export default UnifiedLoginForm;
