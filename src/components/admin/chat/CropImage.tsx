import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import type { Conversation, Message } from "../../../../chat";
import { postToast } from "@/components/postToast";
import ImageCropper from "./ImageCropper";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MessageForm } from "@/app/(user)/(non_auth)/chat/[chatId]/_components/CaptionMessageForm";
import { SelectImageButton } from "@/app/(user)/(non_auth)/chat/[chatId]/_components/SelectImageButton";
import Loading from "@/app/loading";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import useScrollRef from "@/lib/hooks/useScrollRef";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import { Timestamp } from "firebase/firestore";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import { getCustomTimestamp } from "@/lib/utils/custom-timestamp";

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

type Props = {
  chatId: string;
  openEdit: boolean;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
  message: Conversation;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  owns?: string;
};

const ASPECT_RATIO = undefined;
const MIN_DIMENSION = 100;

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const CropImage = ({
  openEdit,
  setOpenEdit,
  message,
  owns,
  chatId,
  scrollToBottom,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>();
  const [imgSrc, setImgSrc] = useState("");
  const [realUrl, setRealUrl] = useState("");
  const [edit, setEdit] = useState(false);

  const { updateConversation, conversation } = useMessagesStore();
  const adminConversationStore = adminCurrConversationStore();

  const sendImageAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      postToast("Error", { description: "Image is required." });
      return;
    }

    setOpenEdit(false);

    try {
      if (image && image.size > 8000000) {
        postToast("Warning!", {
          description:
            "Image size is too big and might take a while to load. Please wait...",
        });
      }

      const metadata = {
        type: image.type,
        size: image.size,
        name: image.name,
      };

      const url = `/chatImages/${chatId}/greatexchange.co__${v4()}__${
        user?.uid
      }_${image.name}`;

      const base64 = await fileToBase64(image);

      const reqParams = {
        image: base64,
        metadata,
        url,
        uid: user.uid,
        chatId: chatId,
        caption,
        owns: owns,
        recipient:
          owns === "admin"
            ? adminConversationStore.conversation?.user
            : conversation?.user,
      };

      const res = await fetch(`/api/sendimage`, {
        body: JSON.stringify(reqParams),
        method: "POST",
      }).then((e) => e.json());

      if (res.success) {
        postToast("Image sent", { icon: <>✔️</> });
        setProgress(0);
        setCaption("");
        setError("");
        // setLoading(false);
        scrollToBottom.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        postToast("Error", {
          description: "An error occured while sending image.",
        });
      }
    } catch (error) {
      error instanceof Error && console.error(error.message);
    } finally {
      // setLoading(false);
      setImage(null);
      setImgSrc("");
    }
  };

  const updateConvo = () => {
    if (!image) {
      postToast("Error", { description: "Image is required." });
      return;
    }

    if (image && image.size > 8000000) {
      postToast("Warning!", {
        description:
          "Image size is too big and might take a while to load. Please wait...",
      });
    }

    const msg = {
      id: v4(),
      timeStamp: new Date(), // replaced_date,
    };

    const newMessage: Message = {
      id: msg.id,
      type: "media",
      deleted: false,
      timeStamp: getCustomTimestamp(), // date_replaced,
      sender: {
        username: user.displayName,
        uid: user.uid,
      },
      recipient: owns === "admin" ? "user" : "admin",
      card: {
        title: "",
        data: {},
      },
      content: {
        caption: caption,
        url: URL.createObjectURL(image),
        text: caption,
        media: {
          text: "",
          caption: caption,
          url: URL.createObjectURL(image),
          metadata: {
            media_name: image.name,
            media_type: image.type,
            media_size: String(image.size),
          },
        },
      },
      edited: false,
      read_receipt: {
        delivery_status: "not_sent",
        status: false,
        time: getCustomTimestamp(), // date_replaced,
      },
    };

    if (owns === "admin") {
      adminConversationStore.updateConversation({
        ...message,
        id: message?.id || "",
        messages: [...(message?.messages || []), newMessage],
      } as Conversation);
    } else {
      updateConversation(
        {
          ...message,
          id: message?.id || "",
          messages: [...(message?.messages || []), newMessage],
        } as Conversation,
        scrollToBottom
      );
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Dialog
        open={openEdit}
        onOpenChange={(e) => {
          setOpenEdit(e);
          if (e === false) {
            setImage(null);
            setImgSrc("");
          }
        }}
      >
        <DialogContent className="w-[100vw] max-w-md rounded-2xl border-2 border-black">
          <DialogHeader>
            {imgSrc && (
              <button
                disabled={loading}
                className="absolute left-2 md:left-1/2 md:-translate-x-1/2 bg-white py-1.5 hover:bg-neutral-200 dark:hover:bg-black bg-opacity-30 backdrop-blur-lg rounded-md border px-2 flex align-middle place-items-center gap-1.5"
                onClick={() => {
                  setImgSrc("");
                  setImage(null);
                }}
              >
                <ArrowLeftIcon width={14} />
                Clear
              </button>
            )}

            <DialogTitle className="text-lg font-bold">Edit image</DialogTitle>
          </DialogHeader>

          {imgSrc ? (
            <ImageCropper
              edit={edit}
              setEdit={setEdit}
              setImage={setImage}
              image={image}
              ASPECT_RATIO={ASPECT_RATIO}
              MIN_DIMENSION={MIN_DIMENSION}
              imgSrc={imgSrc}
              setImgSrc={setImgSrc}
              loading={loading}
            />
          ) : (
            <SelectImageButton
              setImage={setImage}
              setImgSrc={setImgSrc}
              setRealUrl={setRealUrl}
            />
          )}

          {imgSrc && !edit && (
            <div>
              <div className="mb-3 w-[50%] mx-auto flex align-middle place-items-center gap-2">
                {progress > 0 && <Progress value={progress} />}
              </div>
              <div
                className={`text-red-500 text-xs text-center mb-1 transition-all duration-100 font-bold dark:bg-black rounded-xl overflow-clip text-clip absolute  px-2 top-10 left-1/2 -translate-x-1/2 delay-100 opacity-0 ${
                  error ? "h-fit w-fit p-0.5 opacity-80" : "h-0 w-0 p-0"
                }`}
              >
                {error}
              </div>

              {/* <MessageForm
                caption={caption}
                setLoading={setLoading}
                edit={edit}
                loading={loading}
                setCaption={setCaption}
                // sendImageAction={sendImageAction}
                // updateConvo={updateConvo}
              /> */}
            </div>
          )}
          <Image
            src={realUrl}
            alt=""
            width={0}
            height={0}
            className="hidden"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (
                imgSrc &&
                (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION)
              ) {
                postToast("Image", {
                  description: "Image must be at least 100 x 100 pixels.",
                });
                setRealUrl("");
                setImgSrc("");
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CropImage;
