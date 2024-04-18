"use client";

import { postToast } from "@/components/postToast";
import { sendEmailVerification } from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "@/lib/utils/firebase";
import { useEffect, useState } from "react";
import { EnvelopeOpenIcon, SunIcon } from "@radix-ui/react-icons";

type Props = {};

const VerificationButton = (props: Props) => {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    if (disable) {
      const unsubscribe = setInterval(() => {
        setCounter((prev) => prev++);
      }, 1000);

      if (counter > 60) {
        clearInterval(unsubscribe);
        setDisable(false);
      }
    }
  }, [counter, disable]);

  const verifyEmailLink = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        postToast("NULL", {
          description: "User not found",
          icon: <>❌</>,
        });
        return;
      }

      await sendEmailVerification(auth.currentUser);

      Cookies.set("verification", "sent");
      setDisable(true);
      postToast("Sent", {
        description: `A verification link has been sent to ${auth.currentUser.email}.`,
        icon: <>✅</>,
      });
    } catch (error) {
      console.error("ERROR_SENDING_EMAIL_VERIFICATION:", error);
      postToast("Error", {
        description: "Error sending verification link, Try again.",
        icon: <>❌</>,
      });
    } finally {
      setLoading(false);
    }
  };

  if (auth.currentUser?.emailVerified) {
    return null;
  } else {
    return (
      <button
        disabled={disable || loading}
        onClick={() => verifyEmailLink()}
        className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5 text-emerald-500"
      >
        <EnvelopeOpenIcon strokeWidth={2} width={18} />{" "}
        <span>
          {loading ? (
            <div className="flex align-middle place-items-center justify-start gap-4">
              <SunIcon className="animate-spin text-xs" />
              <span>Resending...</span>
            </div>
          ) : disable ? (
            `Resend in ${counter}`
          ) : (
            "Resend verification email"
          )}
        </span>
      </button>
    );
  }
};

export default VerificationButton;
