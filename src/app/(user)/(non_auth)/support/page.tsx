"use client";
import SuccessCheckmark from "@/components/successMark";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendReport } from "@/lib/utils/actions/support-report";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type Props = {};

const SupportPage = (props: Props) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (error) setError("");
    }, 5000);
  }, [error]);

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await sendReport(
        new FormData(e.target as HTMLFormElement)
      );
      if (result.success) {
        setSent(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 px-4 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
          Contact Support
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 font-light leading-6">
          Address any challenges you encounter while using our platform. Whether
          it&apos;s a technical glitch, a transactional hiccup, valuable
          feedback, or simply a helpful remark, we&apos;re here to listen and
          improve.
        </p>
      </div>

      <AlertDialog open={sent} onOpenChange={setSent}>
        <AlertDialogContent className="text-xl font-bold text-neutral-700 dark:text-neutral-300">
          <AlertDialogDescription>
            <div>
              <SuccessCheckmark />
            </div>
            <h4 className="text-center">Sent!</h4>
          </AlertDialogDescription>
          <AlertDialogCancel onClick={() => setSent(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
      <form
        onSubmit={submitReport}
        className="mx-auto mt-16 max-w-xl sm:mt-20 dark:bg-neutral-800 dark:border dark:border-neutral-700 bg-neutral-200 container rounded-lg py-8"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="">
            <label htmlFor="country" className="sr-only">
              Reason
            </label>
            <select
              id="reason"
              required
              aria-required
              name="reason"
              className="border p-2 border-neutral-600 rounded-lg w-full bg-transparent"
            >
              <option
                value={""}
                className="dark:bg-neutral-700 text-neutral-500"
              >
                Select a reason...
              </option>
              <option className="dark:bg-neutral-700">Transactional</option>
              <option className="dark:bg-neutral-700" value="technical">
                Technical
              </option>
              <option className="dark:bg-neutral-700" value="feedback">
                Feedback
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-neutral-900 dark:text-white"
            >
              Name
            </label>
            <div className="mt-1.5">
              <Input
                type="text"
                name="name"
                id="name"
                autoComplete="firstName"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-neutral-900 dark:text-white"
            >
              Email
            </label>
            <div className="mt-1.5">
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold text-neutral-900 dark:text-white"
            >
              Phone number
            </label>
            <div className="relative mt-1.5">
              <Input
                type="tel"
                name="phoneNumber"
                id="phone-number"
                autoComplete="phone"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-neutral-900 dark:text-white"
            >
              Message
            </label>
            <div className="mt-1.5">
              <textarea
                name="message"
                id="message"
                required
                aria-required
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-red-500 text-center">{error && error}</p>
          <Button className="w-full">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default SupportPage;
