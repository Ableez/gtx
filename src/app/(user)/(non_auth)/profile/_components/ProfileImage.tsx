import { Button } from "@/components/ui/button";
import {
  PencilSquareIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { User } from "../../../../../../types";
import { User as FirebaseUser, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { postToast } from "@/components/postToast";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "@/lib/utils/firebase";
import useErrorHandler from "@/lib/hooks/useErrorHandler";
import { Progress } from "@/components/ui/progress";
import { fileToBase64 } from "@/lib/utils/fileConverter";
import Cookies from "js-cookie";
import SuccessCheckmark from "@/components/successMark";

type Props = {
  user: User | null;
};

const ProfileImage = ({ user }: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { handleFirebaseError } = useErrorHandler();

  const updateImage = async () => {
    setLoading(true);

    try {
      // if (
      //   image &&
      //   image.size < 5000000 &&
      //   user?.photoURL !== imageUrl &&
      //   imageUrl !== "/logoplace.svg"
      // ) {
      if (image && image.size > 5000000) {
        postToast("🖼️ Attention!", {
          description: "Image size must be less than 5MB",
        });
        setLoading(false);
        return;
      }

      const fileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Error converting file to base64"));
            }
          };
          reader.readAsDataURL(file);
        });
      };

      const base64 = await fileToBase64(image as File);

      const res = await fetch("/api/user/update_profile_picture", {
        body: JSON.stringify({
          image: base64,
          uid: user?.uid,
          metadata: {
            name: image?.name,
            size: image?.size,
            type: image?.type,
          },
        }),
        method: "POST",
      }).then((res) => res.json());

      if (res.message === "user_not_found") {
        postToast("🖼️ Attention!", {
          description: "User not found",
        });
        window.location.href = "/sell";
        return;
      }

      await updateProfile(auth.currentUser as FirebaseUser, {
        photoURL: res.url,
      });

      setSent(true);

      Cookies.set("user", JSON.stringify({ ...user, photoURL: res.url }));

      postToast("Profile picture updated", {
        icon: (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                clipRule="evenodd"
              />
            </svg>
          </>
        ),
      });

      window.location.reload();
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative w-fit mx-auto">
        {image && !loading && (
          <Button
            onClick={() => {
              if (image) {
                setImage(null);
                setImageUrl(user?.photoURL as string);
              }
            }}
            type="button"
            variant={"outline"}
            title="Cancel"
            className="absolute -right-8 bg-white dark:bg-neutral-800 rounded-full top-0 z-50"
          >
            <XMarkIcon width={16} />
          </Button>
        )}
        <div
          className={`${
            image && "ring-rose-500"
          } w-fit rounded-full duration-500 relative ring-2 ring-transparent p-0.5 overflow-clip mx-auto group`}
        >
          <Image
            src={
              imageUrl || user?.imageUrl || user?.photoURL || "/logoplace.svg"
            }
            alt="User Profile image"
            width={100}
            height={100}
            priority
            className={`${
              loading && "opacity-40"
            } rounded-full overflow-clip aspect-square object-cover bg-white/40 dark:bg-neutral-700 animate-appear-in relative`}
          />
          {loading && (
            <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-4">
              <SunIcon width={24} className="text-secondary animate-spin" />
            </span>
          )}

          {!sent && (
            <label
              className={`bg-neutral-600 bg-opacity-10 backdrop-blur-sm absolute group-hover:bottom-0 duration-300 left-1/2 -translate-x-1/2 p-4 w-full text-center text-xs font-bold -bottom-full ${
                loading && "cursor-not-allowed"
              }`}
              title="Edit profile image"
            >
              <PencilSquareIcon
                width={18}
                className="mx-auto mix-blend-difference text-white"
              />
              <input
                //   disabled={loading}
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
                id="setProfilePicture"
                ref={imageRef}
              />
            </label>
          )}
        </div>
      </div>

      <div className="w-full grid place-items-start justify-center mt-2">
        {(!user?.photoURL || image) && image ? (
          <Button
            disabled={sent || loading}
            className="my-2 mx-auto w-fit"
            onClick={() => {
              updateImage();
            }}
          >
            Update
          </Button>
        ) : (
          <Button
            disabled={sent || loading}
            onClick={() => {
              if (imageRef.current) {
                imageRef.current.click();
              }
            }}
            className="my-2 mx-auto w-fit"
          >
            Set picture
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
