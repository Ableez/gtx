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
import { auth, db } from "@/lib/utils/firebase";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

type Props = {};

const SupportPage = (props: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "NG",
    phoneNumber: "",
    message: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [respond, setRespond] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(formData);
  };

  const sendReport = async () => {
    setRespond(false);
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.reason === "" ||
      formData.message === "" ||
      formData.phoneNumber === "" ||
      formData.country === ""
    ) {
      setError("All fields must be required");
      return;
    }

    try {
      const ref = collection(db, "Reports");
      await addDoc(ref, {
        type: formData.reason === "transaction" ? "report" : "feedback",
        cause: formData.reason,
        details: {
          subject: `A ${formData.reason} report`,
          body: formData.message,
        },
        date: new Date(),
        user: {
          uid:
            auth.currentUser?.uid ||
            JSON.parse(localStorage.getItem("uid") as string),
          username: auth.currentUser?.displayName || formData.name,
          email: auth.currentUser?.email || formData.email,
        },
        read: false,
      }).then(() => {
        setRespond(true);
        setFormData({
          name: "",
          email: "",
          country: "NG",
          phoneNumber: "",
          message: "",
          reason: "",
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="isolate bg-white dark:bg-neutral-800 py-24 sm:py-32 px-4">
      <div className="mx-auto max-w-2xl text-center container">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
          Contact Support
        </h2>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-light leading-5">
          Address any challenges you encounter while using our platform. Whether
          it&apos;s a technical glitch, a transactional hiccup, valuable
          feedback, or simply a helpful remark, we&apos;re here to listen and
          improve.
        </p>
      </div>

      <AlertDialog open={respond}>
        <AlertDialogContent className="text-xl font-bold text-neutral-700 dark:text-neutral-300">
          <AlertDialogDescription>
            <div>
              <SuccessCheckmark />
            </div>
            <h4 className="text-center">Sent!</h4>
          </AlertDialogDescription>
          <AlertDialogCancel onClick={() => setRespond(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form Data:", formData);
          sendReport();
        }}
        className="mx-auto mt-16 max-w-xl sm:mt-20 bg-neutral-900 container rounded-lg py-8"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="">
            <label htmlFor="country" className="sr-only">
              Reason
            </label>
            <select
              id="reason"
              name="reason"
              className="border p-2 border-neutral-600 rounded-lg w-full bg-transparent"
              value={formData.reason}
              onChange={(e) => handleInputChange(e)}
            >
              <option
                value={""}
                className="dark:bg-neutral-700 text-neutral-500"
              >
                Select a reason...
              </option>
              <option className="dark:bg-neutral-700" value="transaction">
                Transactional
              </option>
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
                value={formData.name}
                onChange={(e) => handleInputChange(e)}
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
                value={formData.email}
                onChange={(e) => handleInputChange(e)}
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
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Reason
                </label>
                <select
                  id="reason"
                  name="reason"
                  autoComplete="reason"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  value={formData.reason}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="NG">NG</option>
                  <option value="UK">UK</option>
                  <option value="GH">GH</option>
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute right-3 top-0 h-full w-5 text-neutral-400"
                  aria-hidden="true"
                />
              </div>
              <Input
                type="tel"
                name="phoneNumber"
                id="phone-number"
                autoComplete="phone"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange(e)}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
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
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange(e)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>
          {error && (
            <div className="sm:col-span-2">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          <Button className="w-full">Send</Button>
        </div>
      </form>
    </div>
  );
};

export default SupportPage;
