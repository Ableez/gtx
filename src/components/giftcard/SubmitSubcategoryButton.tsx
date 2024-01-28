import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Loader from "../Loader";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  data: {
    logged: boolean;
    loading: boolean;
    setLoading: boolean;
    form: {
      subcategory: string;
      price: number;
    };
  };
};

const SubmitSubcategoryButton = ({ data }: Props) => {
  const { logged, loading, form } = data;
  return (
    <div>
      <AlertDialog>
        {logged ? (
          <AlertDialogTrigger asChild>
            <Button
              disabled={loading || form.price < 3 || form.subcategory === ""}
              className="w-full h-12 shadow-lg shadow-pink-300 dark:shadow-pink-950 disabled:bg-opacity-50"
            >
              {loading ? (
                <>
                  <Loader /> Please wait...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </AlertDialogTrigger>
        ) : (
          <Link href={"/login"}>
            <Button
              onClick={() => setLoading(true)}
              disabled={loading}
              className={`w-full h-12 shadow-lg shadow-pink-300 dark:shadow-pink-950 disabled:bg-opacity-50 ${
                loading && "bg-opacity-50"
              }`}
            >
              {loading && <Loader />}
              Login to continue
            </Button>
          </Link>
        )}

        <AlertDialogContent>
          <AlertDialogCancel className="absolute top-2 right-4 bg-neutral-200 dark:bg-neutral-800 rounded-full p-2">
            <XMarkIcon width={20} />
          </AlertDialogCancel>
          <AlertDialogHeader className="py-4">
            <AlertDialogTitle>How would you like to sell</AlertDialogTitle>
            <AlertDialogDescription>
              Select Live Chat for quick payout
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-flow-col gap-6">
            <AlertDialogAction
              disabled={loading}
              onClick={() => selectsWhatsApp("whatsapp")}
              className="bg-slate-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 border-neutral-300 border text-neutral-800 shadow-none py-4 rounded-xl disabled:bg-opacity-50"
            >
              WhatsApp
            </AlertDialogAction>
            <AlertDialogAction
              disabled={loading}
              onClick={() => selectsLive("live")}
              className="bg-primary shadow-none py-4 rounded-xl disabled:bg-opacity-50 text-white font-semibold"
            >
              Live Chat
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubmitSubcategoryButton;
