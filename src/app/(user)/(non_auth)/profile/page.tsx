"use client";

import {
  ArrowLeftIcon,
  Cog8ToothIcon,
  CurrencyDollarIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User, signOut, updateEmail, updateProfile } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { auth, db, storage } from "@/lib/utils/firebase";
import ToggleTheme from "@/components/toggleTheme";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import { Progress } from "@/components/ui/progress";
import { doc, updateDoc } from "firebase/firestore";
import Loading from "@/app/loading";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";
import { postToast } from "@/components/postToast";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const user = Cookies.get("user");

const UserProfile = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [imageUrl, setImageUrl] = useState("/logoplace.svg");
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    username: {
      value: user?.displayName,
      editted: false,
    },
    email: {
      value: user?.email,
      editted: false,
    },
  });

  useEffect(() => {
    const cachedUser = Cookies.get("user");

    if (!cachedUser) {
      alert("You need to login to view profile information");
      router.replace("/sell");
      return;
    }

    const user = JSON.parse(cachedUser as string);
    setUser(user as User);

    setImageUrl(user.photoURL satisfies User);

    setForm((prev) => {
      return {
        email: {
          value: user?.email,
          editted: false,
        },
        username: {
          value: user?.displayName,
          editted: false,
        },
      };
    });
  }, [router]);

  useEffect(() => {
    if (user?.displayName !== form.username.value) {
      setForm((prev) => {
        return {
          ...prev,
          username: { ...prev.username, editted: true },
        };
      });
    } else {
      setForm((prev) => {
        return {
          ...prev,
          username: { ...prev.username, editted: false },
        };
      });
    }

    if (user?.email !== form.email.value) {
      setForm((prev) => {
        return {
          ...prev,
          email: { ...prev.email, editted: true },
        };
      });
    } else {
      setForm((prev) => {
        return {
          ...prev,
          email: { ...prev.email, editted: false },
        };
      });
    }
  }, [form.email.value, form.username.value, user?.displayName, user?.email]);

  const update = async () => {
    try {
      const user = auth.currentUser;

      console.log(loading);
      if (user) {
        const userRef = doc(db, "Users", user.uid);

        if (
          form.username.editted &&
          form.username.value &&
          user.displayName !== form.username.value
        ) {
          await updateProfile(user, { displayName: form.username.value });
          await updateDoc(userRef, { username: form.username.value });

          Cookies.set("user", JSON.stringify(user.toJSON()));

          setForm((prev) => {
            return {
              ...prev,
              username: {
                value: user?.displayName,
                editted: false,
              },
            };
          });

          postToast("Username updated!", {
            description: "Your username has been updated!",
          });
        }

        if (
          form.email.editted &&
          form.email.value &&
          user.email !== form.email.value
        ) {
          await updateEmail(user, form.username.value as string);
          await updateDoc(userRef, { email: form.username.value });

          Cookies.set("user", JSON.stringify(user.toJSON()));

          setForm((prev) => {
            return {
              ...prev,
              email: {
                value: user?.email,
                editted: false,
              },
            };
          });

          postToast("Email updated!", {
            description: "Your email has been updated.",
          });
        }

        if (
          image &&
          image.size < 5000000 &&
          user.photoURL !== imageUrl &&
          imageUrl !== "/logoplace.svg"
        ) {
          if (image && image.size > 5000000) {
            setError("Image size must be less than 5MB");
            setLoading(false);
            return;
          }

          const uuid = v4();

          const storageRef = ref(
            storage,
            `/profile_images/www.greatexchange.co---${user.uid}---profile_image---${image.name}---${uuid} `
          );

          setProgress(1);

          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snap) => {
              const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
              setProgress(progress);
            },
            (err) => {
              console.log("ERROR UPDATING IMAGE :: ", err);
              postToast("Not updated!", {
                description: "Could not update image. Please try again.",
              });
              setError(err.message);
            },
            async () => {
              const mediaurl = await getDownloadURL(uploadTask.snapshot.ref);
              setProgress(100);
              setSent(true);
              await updateProfile(user, {
                photoURL: mediaurl,
              });
              await updateDoc(userRef, {
                imageUrl: mediaurl,
              });

              setImage(null);
              postToast("Image updated!", {
                description: "Your profile image has been updated",
              });
              router.refresh();
            }
          );
        }
      }
    } catch (error) {
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
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

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

  if (!user) {
    postToast("Unauthorized", {
      description: "You are not logged in",
      action: {
        label: "Login",
        onClick: () => router.push("/login"),
      },
    });
  }

  return (
    <div className="px-4 space-y-5 pb-8 py-4 max-w-screen-sm mx-auto">
      <form action={update}>
        <div className="relative w-fit mx-auto">
          {image && (
            <button
              onClick={() => {
                if (image) {
                  setImage(null);
                  setImageUrl(user?.photoURL as string);
                }
              }}
              type="button"
              title="Cancel"
              className="absolute -right-6 rounded-full top-0 z-50 p-1 dark:bg-neutral-700 bg-neutral-200 border-2 border-transparent dark:hover:border-neutral-600 hover:border-neutral-300"
            >
              <XMarkIcon width={16} />
            </button>
          )}
          <div
            className={`${
              image && "ring-rose-500"
            } w-fit rounded-full duration-500 relative ring-2 ring-transparent p-0.5 overflow-clip mx-auto group`}
          >
            <Image
              src={imageUrl || "/logoplace.svg"}
              alt="User Profile image"
              width={100}
              height={100}
              priority
              className={`${
                loading && "opacity-50"
              } rounded-full overflow-clip aspect-square object-cover border-2 p-2 bg-white dark:bg-neutral-700`}
            />
            <label
              className={`bg-neutral-200 bg-opacity-10 backdrop-blur-md absolute group-hover:bottom-0 duration-300 left-1/2 -translate-x-1/2 p-3 w-full text-center text-xs font-bold -bottom-full ${
                loading && "cursor-not-allowed"
              }`}
              title="Edit profile image"
            >
              <PencilSquareIcon
                width={18}
                strokeWidth={2}
                className="mx-auto"
              />
              <input
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImage(file as File);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImageUrl(url);
                  }
                }}
                accept="image/*"
                type="file"
                className="hidden"
                placeholder="Image"
              />
            </label>
          </div>
        </div>

        <div>
          {user ? (
            <>
              <div
                className={`${
                  form.username.editted &&
                  "border-b-2 border-neutral-700 bg-purple-100 dark:bg-purple-500 dark:bg-opacity-10 hover:border-neutral-400 "
                } disabled:text-neutral-400 disabled:cursor-not-allowed flex align-middle w-full duration-300 hover:bg-opacity-60 border-b border-neutral-200 outline-none focus-within:outline-none hover:border-neutral-500 px-3 py-3.5`}
              >
                <input
                  defaultValue={user.displayName as string}
                  value={form.username.value as string}
                  disabled={!user?.displayName}
                  onChange={(e) => {
                    setForm((prev) => {
                      return {
                        ...prev,
                        username: { ...prev.username, value: e.target.value },
                      };
                    });
                  }}
                  contentEditable
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  aria-label="username"
                  className=" outline-none focus-within:outline-none hover:border-neutral-500 w-full bg-transparent"
                />
                {form.username.editted && (
                  <button
                    type="button"
                    title="Cancel"
                    onClick={() => {
                      setForm((prev) => {
                        return {
                          ...prev,
                          username: {
                            editted: false,
                            value: user?.displayName,
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
                )}
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
                className={`${
                  form.email.editted &&
                  "border-b-2 border-neutral-700 bg-purple-100 dark:bg-purple-500 dark:bg-opacity-10 hover:border-neutral-400 "
                } disabled:text-neutral-400 disabled:cursor-not-allowed flex align-middle w-full duration-300 hover:bg-opacity-60 border-b border-neutral-200 outline-none focus-within:outline-none hover:bor
            der-neutral-500 px-3 py-3.5`}
              >
                <input
                  defaultValue={user.email as string}
                  value={form.email.value as string}
                  disabled={!user?.email}
                  onChange={(e) => {
                    setForm((prev) => {
                      return {
                        ...prev,
                        email: { ...prev.email, value: e.target.value },
                      };
                    });
                  }}
                  contentEditable
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  aria-label="email"
                  id={"profile-email"}
                  className=" outline-none focus-within:outline-none hover:border-neutral-500 w-full bg-transparent"
                />

                {form.email.editted && (
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
                )}
                {!user?.displayName && (
                  <SunIcon
                    title="Loading"
                    className="animate-spin text-neutral-400 dark:text-neutral-600"
                    width={18}
                    strokeWidth={2}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="grid grid-flow-row gap-4">
              <Skeleton className="w-full px-3 py-5 border-b border-neutral-400 rounded-none " />
              <Skeleton className="w-full px-3 py-5 border-b border-neutral-400 rounded-none " />
            </div>
          )}
        </div>

        <div className="mt-2 mb-1 max-w-[70px] ml-auto h-3 flex align-middle place-items-center justify-end">
          {progress > 0 && (
            <Progress className="duration-1000" value={progress} />
          )}
        </div>
        <div className="flex justify-end mt-2">
          <Button
            className="flex align-middle place-items-center gap-1"
            // onClick={() => {
            //   setLoading(true);
            // }}
            disabled={
              (!form.username.editted && !form.email.editted && !image) ||
              loading
            }
          >
            {loading ? (
              <>
                <SunIcon className="animate-spin" width={20} strokeWidth={2} />
                <span>Updating</span>
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
      <div>
        <button
          onClick={() => {
            router.push("/chat");
          }}
          className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5"
        >
          <ChatBubbleIcon width={18} /> <span>View conversations</span>
        </button>
        <button
          onClick={() => {
            router.push("/transactions");
          }}
          className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5"
        >
          <CurrencyDollarIcon width={18} /> <span>Transactions</span>
        </button>
        <button
          onClick={() => {
            router.push("/iforgot");
          }}
          className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5"
        >
          <EyeSlashIcon width={18} /> <span>Reset password</span>
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            router.push("/support");
          }}
          className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5 text-amber-500"
        >
          <InformationCircleIcon strokeWidth={2} width={18} />{" "}
          <span>Report an issue</span>
        </button>
        <button
          onClick={async () => {
            await signOut(auth);
            Cookies.remove("user");
            Cookies.remove("isLoggedIn");
            router.push("/sell");
          }}
          className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5 text-rose-500"
        >
          <XMarkIcon strokeWidth={2} width={18} /> <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
