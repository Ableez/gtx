"use client";

import { useEffect, useState } from "react";
import { PencilIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { auth, db, storage } from "@/lib/utils/firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import {
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { postToast } from "@/components/postToast";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { User } from "../../../../../../types";
import { FirebaseError } from "firebase/app";
import { User as FirebaseUser } from "firebase/auth";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import ProfileImage from "./ProfileImage";

type Props = {};

const UserInfoForm = (props: Props) => {
  const cachedUser = Cookies.get("user");
  const verificationState = Cookies.get("verification");
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [form, setForm] = useState(() => {
    return {
      username: {
        value: user?.displayName,
        editted: false,
      },
      email: {
        value: user?.email,
        editted: false,
      },
    };
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setProgress(0);
      }, 4000);
    }

    if (sent) {
      setTimeout(() => {
        setSent(true);
      }, 4000);
    }
  }, [progress, sent]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  if (mounted && !cachedUser) {
    postToast("Unauthorized", {
      description: "You are not logged in",
    });

    redirect("/login");
  }

  const update = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }

      const userRef = doc(db, "Users", user.uid);

      await updateUsername(user, userRef);
      await updateUEmail(user, userRef);
    } catch (error) {
      handleError(error);
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

  const updateUsername = async (
    user: FirebaseUser,
    userRef: DocumentReference<DocumentData>
  ) => {
    if (
      form.username.value !== user.displayName &&
      form.username.value &&
      user?.displayName !== form.username.value
    ) {
      await updateProfile(user, { displayName: form.username.value });
      await updateDoc(userRef, { username: form.username.value });

      Cookies.set("user", JSON.stringify(user.toJSON()));

      setForm((prev) => ({
        ...prev,
        username: {
          value: user?.displayName as string,
          editted: false,
        },
      }));

      postToast("Username updated!", {
        description: "Your username has been updated!",
      });
    }
  };

  const updateUEmail = async (
    user: FirebaseUser,
    userRef: DocumentReference<DocumentData>
  ) => {
    if (
      form.email.value !== user?.email &&
      form.email.value &&
      user.email !== form.email.value
    ) {
      await updateEmail(user, form.username.value as string);
      await updateDoc(userRef, { email: form.username.value });

      Cookies.set("user", JSON.stringify(user.toJSON()));

      setForm((prev) => ({
        ...prev,
        email: {
          value: user?.email as string,
          editted: false,
        },
      }));

      postToast("Email updated!", {
        description: "Your email has been updated.",
      });
    }
  };

  const handleError = (error: any) => {
    console.error("UPDATE_PROFILE", error);
    const err = error as FirebaseError;

    postToast("Update failed!", {
      description:
        err?.code === "auth/user-not-found"
          ? "Waoh! Seems like user is a ghost. They don't exists on out records."
          : err.code === "auth/network-request-failed"
          ? "Network request failed❌. Seems like village people at work🏗️."
          : err.code === "auth/too-many-requests"
          ? "You don try this thing too much. Chill abeg. Try again in a minute or two."
          : "Something went wrong. Try again",
    });
  };

  if (!mounted) {
    return (
      <div className="h-[44dvh]">
        <Skeleton className="w-28 h-28 rounded-full mx-auto" />
        <div className="grid grid-flow-row gap-4 mt-5">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileImage user={user} />
      <form action={update}>
        <div>
          {user ? (
            <>
              <div
                className={`${
                  form.username.value !== user.displayName &&
                  "border-neutral-700 bg-purple-100 dark:bg-purple-500 dark:bg-opacity-10 hover:border-neutral-400"
                } border-b disabled:text-neutral-400 disabled:cursor-not-allowed flex align-middle w-full duration-300 hover:bg-opacity-60 border-neutral-200 dark:border-neutral-700 outline-none focus-within:outline-none px-3 py-3.5 animate-appear-in ${
                  edit &&
                  "border-purple-500 ring-2 ring-purple-500/20 rounded-lg"
                }`}
              >
                <input
                  value={form.username.value as string}
                  disabled={!user?.displayName || !edit}
                  onChange={(e) => {
                    setForm((prev) => {
                      return {
                        ...prev,
                        username: {
                          ...prev.username,
                          value: e.target.value,
                        },
                      };
                    });
                  }}
                  contentEditable
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  aria-label="username"
                  className="outline-none focus-within:outline-none hover:border-neutral-500 w-full bg-transparent"
                />
                {!user?.displayName && (
                  <SunIcon
                    title="Loading"
                    className="animate-spin text-neutral-400 dark:text-neutral-600"
                    width={18}
                    strokeWidth={2}
                  />
                )}
              </div>
              <div
                className={`border-b disabled:text-neutral-400 disabled:cursor-not-allowed flex align-middle w-full border-neutral-200 dark:border-neutral-700 outline-none focus-within:outline-none px-3 py-3.5 animate-appear-in delay-75 place-items-center justify-between ${
                  !user.emailVerified &&
                  "bg-red-100 font-medium dark:bg-red-500 dark:bg-opacity-10"
                }`}
              >
                <h4>{user.email || ""}</h4>
                {!user.emailVerified ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setVerificationLoading(true);
                        if (!auth.currentUser) {
                          postToast("NULL", {
                            description: "User not found",
                            icon: <>❌</>,
                          });
                          return;
                        }

                        await sendEmailVerification(auth.currentUser);

                        Cookies.set("verification", "sent");
                        postToast("Sent", {
                          description: `A verification link has been sent to ${auth.currentUser.email}. Check your                  inbox or spam folder.`,
                          icon: <>✔️</>,
                        });
                      } catch (error) {
                        console.error(
                          "ERROR_SENDING_EMAIL_VERIFICATION:",
                          error
                        );
                        postToast("Error", {
                          description:
                            "Error sending verification link, Try again.",
                          icon: <>❌</>,
                        });
                      } finally {
                        setVerificationLoading(false);
                      }
                    }}
                    className={`${
                      verificationLoading ||
                      (verificationState === "sent" &&
                        "bg-purple-300 ring-purple-500 ring-4 ring-opacity-30")
                    } text-[10px] px-4 py-1 grid place-items-center justify-between align-middle bg-purple-500 rounded-sm shadow-sm text-white hover:ring-4 ring-purple-300 ring-opacity-20`}
                    disabled={
                      verificationLoading || verificationState === "sent"
                    }
                    title={
                      verificationState === "sent"
                        ? "Verification sent"
                        : "Verify your email"
                    }
                  >
                    {verificationState !== "sent" ? (
                      verificationLoading ? (
                        <div className="flex align-middle place-items-center justify-between gap-1.5">
                          <SunIcon className="animate-spin" width={14} />
                          <span>Sending</span>
                        </div>
                      ) : (
                        "Verify"
                      )
                    ) : (
                      "Pending"
                    )}
                  </button>
                ) : (
                  <CheckBadgeIcon width={18} className="text-green-400" />
                )}

                {/* {form.email.value !== user?.email && (
                  <button
                    type="button"
                    title="Cancel"
                    onClick={() => {
                      setForm((prev) => {
                        return {
                          ...prev,
                          email: {
                            editted: false,
                            value: user?.email,
                          },
                        };
                      });
                    }}
                  >
                    <XMarkIcon
                      title="Edit username"
                      className="text-purple-800"
                      width={18}
                      strokeWidth={2}
                    />
                  </button>
                )} */}
                {!user?.displayName && (
                  <SunIcon
                    title="Loading"
                    className="animate-spin text-neutral-400 dark:text-neutral-600"
                    width={18}
                    strokeWidth={2}
                  />
                )}
              </div>

              {!user.emailVerified && (
                <h4 className="mt-1 text-xs italic text-destructive">
                  Email has not been verified yet
                </h4>
              )}
            </>
          ) : (
            <div className="grid grid-flow-row gap-4">
              <Skeleton className="w-full px-3 py-5 border-b border-neutral-400 rounded-none " />
              <Skeleton className="w-full px-3 py-5 border-b border-neutral-400 rounded-none " />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <Button
            type="button"
            onClick={() => {
              setEdit((prev) => !prev);

              if (edit)
                setForm((prev) => {
                  return {
                    email: {
                      editted: false,
                      value: user?.email,
                    },
                    username: {
                      editted: false,
                      value: user?.displayName,
                    },
                  };
                });
            }}
            variant={"outline"}
            className="flex align-baseline justify-center gap-1.5 place-items-center"
          >
            {edit ? (
              <>
                <XMarkIcon width={12} /> Cancel
              </>
            ) : (
              <>
                <PencilIcon width={12} /> Edit
              </>
            )}
          </Button>
          {edit && (
            <Button
              className="animate-appear flex align-middle place-items-center gap-1"
              disabled={
                loading ||
                (form.username.value === user?.displayName &&
                  form.email.value === user?.email)
              }
            >
              {loading ? (
                <>
                  <SunIcon
                    className="animate-spin"
                    width={20}
                    strokeWidth={2}
                  />
                  <span>Updating</span>
                </>
              ) : (
                "Update"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;
