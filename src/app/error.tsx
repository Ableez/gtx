"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-white dark:bg-neutral-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            Whoops!
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">
            We are sorry, but something went wrong.
          </p>
          <p className="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">
            Please try again.
          </p>
        </div>
        <Button className="mx-auto" onClick={() => reset()}>Retry</Button>
      </div>
    </section>
  );
}
