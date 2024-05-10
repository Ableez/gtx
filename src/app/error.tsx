"use client";

import PageDataFetchError from "@/components/PageDataFetchError";
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
    // <section className="bg-white dark:bg-black h-screen">
    //   <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
    //     <div className="mx-auto max-w-screen-md text-center">
    //       <h1 className="mb-4 text-4xl md:text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
    //         Whoops!
    //       </h1>
    //       <p className="mb-4 text-lg tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">
    //         We are sorry, but something went wrong.
    //       </p>
    //       <p className="mb-4 text-sm font-light text-neutral-500 dark:text-neutral-400">
    //         Please try again.
    //       </p>
    //     </div>
    //     <div className="w-full grid place-items-center justify-center">
    //       <Button
    //         className="mx-auto px-16 hover:ring-pink-200 ring-4 ring-transparent duration-300"
    //         onClick={() => reset()}
    //       >
    //         Retry
    //       </Button>
    //     </div>
    //   </div>
    // </section>

    <PageDataFetchError error={error.message} />
  );
}
