"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db, storage } from "@/lib/utils/firebase";
import {
  ChevronRightIcon,
  PhotoIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { User, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  const [editUsername, setEditUsername] = useState({
    edit: false,
    username: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [verificationEmail, setVerification] = useState("");

  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = JSON.parse(localStorage.getItem("uid") as string);

        if (uid) {
          const unsubscribe = onSnapshot(doc(db, "Users", uid), (doc) => {
            setUserData(doc.data() as UserData);
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.log("ERROR FETCHING USER!!", error);
      }
    };

    fetchUser();
  }, [userData]);

  const uploadFile = async (e: BaseSyntheticEvent) => {
    try {
      const storageRef = ref(
        storage,
        `/profileImages/${e.target.files[0].name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setError("Error uploading file");
          console.log("Error uploading file", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setUploadUrl(url);

            updateProfile(auth?.currentUser as User, {
              photoURL: url,
            }).catch((e) => {
              console.log("Error updating user profile", e);
              alert("Error updating profile image");
            });

            //)
            setUploadProgress(0);
          });
        }
      );
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const updateUsername = async () => {
    if (editUsername.username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }

    try {
      await updateProfile(auth?.currentUser as User, {
        displayName: editUsername.username,
      });
      setEditUsername((prev) => {
        return { ...prev, edit: false };
      });
    } catch (error) {
      console.log("Error updating user profile", error);
      alert("Error updating username");
    }
  };

  const sendVerification = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      await sendEmailVerification(auth?.currentUser as User);
      alert("Verification email sent");
    } catch (error) {
      console.log("Error sending verification email", error);
      alert("Error sending verification email");
    }
  };

  return (
    <div>
      <div className="p-8 grid place-items-center gap-2">
        <div className="rounded-full overflow-clip shadow-md w-fit p-1.5 bg-opacity-40 bg-neutral-500 dark:bg-neutral-700 relative group">
          <Image
            src={auth.currentUser?.photoURL || "/logoplace.svg"}
            alt="Your profile"
            width={80}
            height={80}
            className="object-cover w-20 h-20 border-neutral-400 rounded-full"
          />

          <input
            type="file"
            className="hidden"
            id="file"
            name="file"
            onChange={async (e: BaseSyntheticEvent) => {
              if (e.target.files[0]?.size > 3000000) {
                alert("Image size must be less than 3MB");
                return;
              }
              setIsUploading(true);
              await uploadFile(e);
              setIsUploading(false);
            }}
          />
          <label
            htmlFor="file"
            className="h-fit absolute group-hover:bottom-4  left-1/2 -translate-x-1/2 bg-neutral-800 bg-opacity-40 backdrop-blur-sm text-neutral-20 p-1.5 rounded-md group group-hover:opacity-100 opacity-0 -bottom-4 duration-300 group-hover:p-2.5 text-white"
          >
            <PhotoIcon width={25} />
          </label>
        </div>
        <div className="flex align-middle place-items-center gap-3">
          {editUsername.edit ? (
            <Input
              onChange={(e) => {
                setEditUsername((prev) => {
                  return {
                    ...prev,
                    username: e.target.value,
                  };
                });
              }}
              className="capitalize font-bold w-32"
              defaultValue={auth.currentUser?.displayName || "Username"}
            />
          ) : (
            <h4 className=" font-bold dark:text-neutral-200 text-black capitalize">
              {auth.currentUser?.displayName || ""}
            </h4>
          )}

          {editUsername.edit ? (
            <>
              <Button
                onClick={() => {
                  setEditUsername((prev) => {
                    return { ...prev, edit: false };
                  });
                }}
                variant={"ghost"}
                className="border p-2"
              >
                <XMarkIcon width={16} />
              </Button>
              <Button
                onClick={() => {
                  updateUsername();
                }}
                variant={"ghost"}
                className="border p-2"
              >
                <CheckIcon width={16} />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setEditUsername((prev) => {
                  return { ...prev, edit: true };
                });
              }}
              variant={"ghost"}
              className="border p-2"
            >
              <PencilIcon width={16} />
            </Button>
          )}
        </div>
        <div className="flex align-middle place-items-center gap-3 border-t border-neutral-600 py-3">
          <p className="font-light dark:text-neutral-200 text-black text-xs">
            {auth.currentUser?.email}
          </p>
        </div>
        <button
          onClick={(e) => {
            if (!auth.currentUser?.emailVerified) return;
            sendVerification(e);
          }}
          className={`${
            auth.currentUser?.emailVerified
              ? "text-green-800 dark:bg-green-900"
              : "text-red-500 dark:bg-red-800 dark:bg-opacity-20 text-center rounded-lg border border-red-900 dark:text-red-400"
          } font-light dark:text-neutral-200 text-black text-[12px] capitalize leading-none -mt-4 px-2.5 py-1.5`}
        >
          {auth.currentUser?.emailVerified ? "Verified" : "Verify"}
        </button>
      </div>
      <div
        className="grid gap-3
      "
      >
        <Link
          href={`/transactions`}
          className="flex align-middle place-items-center justify-between w-full p-3 bg-white dark:bg-purple-950 dark:bg-opacity-10 border-y border-purple-100 dark:border-purple-900 dark:hover:border-purple-900 duration-300 dark:border-opacity-40 hover:shadow-sm group text-purple-900 dark:text-neutral-200 max-w-md mx-auto "
        >
          <div className="flex align-middle place-items-center justify-between gap-4">
            <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-purple-400 bg-purple-300 dark:border-opacity-40 dark:bg-purple-400 dark:bg-opacity-10">
              <ChatBubbleBottomCenterTextIcon width={22} />
            </div>
            View My Transactions
          </div>

          <ChevronRightIcon
            width={22}
            className="group-hover:ml-2 duration-300 ease-in"
          />
        </Link>
        <Link
          href={`/support`}
          className="flex align-middle place-items-center justify-between w-full p-3 bg-white dark:bg-orange-950 dark:bg-opacity-10 border-y border-orange-100 dark:border-orange-900 dark:hover:border-orange-900 duration-300 dark:border-opacity-40 hover:shadow-sm group text-orange-900 dark:text-neutral-200 max-w-md mx-auto "
        >
          <div className="flex align-middle place-items-center justify-between gap-4">
            <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-red-400 bg-red-300 dark:border-opacity-40 dark:bg-red-400 dark:bg-opacity-10">
              <ChatBubbleBottomCenterTextIcon width={22} />
            </div>
            Report an issue
          </div>

          <ChevronRightIcon
            width={22}
            className="group-hover:ml-2 duration-300 ease-in"
          />
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
