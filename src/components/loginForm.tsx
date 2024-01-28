import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { signInCredentials } from "@/lib/utils/actions/authActions";
import Loading from "@/app/loading";

type Props = {
  url: string | null;
};

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
      className="flex w-full justify-center rounded-md bg-primary px-3 py-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-opacity-40 disabled:cursor-not-allowed gap-3 duration-300"
    >
      {pending && <Loading />}
      Sign in
    </Button>
  );
};

const LoginForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const loginAction = signInCredentials.bind(null, props?.url);
  const [error, setError] = useState<string>("");
  // const [state, formAction] = useFormState(loginAction, {
  //   message: "",
  // });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <div>
      <form
        action={async (e) => {
          loginAction(e).then((res) => {
            console.log(res);
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
              disabled={loading}
              aria-disabled={loading}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-6 text-[15px] text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <SubmitButton setLoading={setLoading} />
        <p
          className={`text-[10px] overflow-clip leading-5 border-neutral-800 animate-out font-medium text-red-500 text-center duration-150 ${
            error ? "opacity-100 h-5 leading-5" : "opacity-100 h-0 leading-10"
          }`}
        >
          {error && error}
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
