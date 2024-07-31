import { postToast } from "@/components/postToast";
import SubmitButton from "./SubmitButton";
import Cookies from "js-cookie";
import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import { v4 } from "uuid";
import { usePathname } from "next/navigation";
import type { Conversation, Message } from "../../../../../../../chat";
import { Timestamp } from "firebase/firestore";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { dataURLtoFile } from "@/lib/utils/fileConverter";
import { TERMINAL_FgGreen } from "../../../../../../../terminal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/utils/firebase";
import { sendAdminMessage } from "@/lib/utils/adminActions/chats";
import { sendUserMessage } from "@/lib/utils/actions/userChat";

type MessageFormProps = {
  loading: boolean;
  caption: string;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
  edit: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenS: React.Dispatch<React.SetStateAction<boolean>>;
  imageUrl: string;
  owns: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  cropperRef: React.MutableRefObject<Cropper | null>;
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const IMAGE_NAME = v4();
const URL_REGEX = /\/(?:admin\/)?chat\/(\w+)$/;

export const MessageForm = ({
  setCaption,
  imageUrl,
  edit,
  caption,
  owns,
  loading,
  setOpenS,
  scrollToBottom,
  setImageUrl,
  setEdit,
  cropperRef,
  setLoading,
}: MessageFormProps) => {
  const { updateConversation, conversation } = useMessagesStore();
  const adminConversationStore = adminCurrConversationStore();
  const chatId = usePathname().split("/")[usePathname().split("/").length - 1];

  const sendImageAction = async () => {
    scrollToBottom.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (!imageUrl) {
      postToast("Error", { description: "Image is required." });
      return;
    }

    setOpenS(false);

    try {
      setLoading(true);
      const url = `/chatImages/${chatId}/${user?.uid}_${IMAGE_NAME}`;

      const recipient =
        owns === "admin"
          ? adminConversationStore.conversation?.user
          : conversation?.user;

      const file = dataURLtoFile(imageUrl, IMAGE_NAME);

      const storageRef = ref(storage, url);

      const uploadTask = await uploadBytes(storageRef, file);

      const mediaurl = await getDownloadURL(uploadTask.ref);

      if (owns === "admin") {
        await sendAdminMessage(
          {
            timeStamp: new Date(),
          },
          chatId as string,
          recipient as {
            username: string;
            uid: string;
            email: string;
            photoUrl: string;
          },
          undefined,
          {
            caption,
            url: mediaurl,
            metadata: {
              media_name: url,
              media_type: "",
              media_size: 0,
            },
          },
          true
        );
      } else {
        await sendUserMessage(
          {
            timeStamp: new Date(),
          },
          chatId as string,
          undefined,
          {
            caption,
            url: mediaurl,
            metadata: {
              media_name: url,
              media_type: "",
              media_size: 0,
            },
          },
          true
        );
      }

      setImageUrl("");
      setEdit(false);
      setCaption("");
      cropperRef.current?.destroy();
    } catch (error) {
      error instanceof Error && console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateConvo = () => {
    const msg = {
      id: v4(),
      timeStamp: Timestamp.fromDate(new Date()),
    };

    const newMessage: Message = {
      id: msg.id,
      type: "media",
      deleted: false,
      timeStamp: msg.timeStamp,
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
        text: caption,
        media: {
          text: "",
          caption: caption,
          url: imageUrl,
          metadata: {
            media_name: IMAGE_NAME,
            media_type: "",
            media_size: "",
          },
        },
      },
      edited: false,
      read_receipt: {
        delivery_status: "not_sent",
        status: false,
        time: msg.timeStamp,
      },
    };

    if (owns === "admin") {
      adminConversationStore.updateConversation({
        ...adminConversationStore.conversation,
        id: adminConversationStore.conversation?.id || "",
        messages: [
          ...(adminConversationStore.conversation?.messages || []),
          newMessage,
        ],
      } as Conversation);
    } else {
      updateConversation(
        {
          ...conversation,
          id: conversation?.id || "",
          messages: [...(conversation?.messages || []), newMessage],
        } as Conversation,
        scrollToBottom
      );
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendImageAction();
      }}
      className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-black rounded-lg max-w-md mx-auto w-full"
    >
      <input
        id="message"
        name="message"
        disabled={loading}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        autoCorrect="true"
        autoComplete="off"
        className={`font-normal transition-all duration-300 resiL-none leading-4 text-xs md:text-sm antialiased focus:outline-none col-span-10 w-full h-fit p-3 bg-neutral-200 dark:bg-black outline-none rounded-l-lg disabled:cursor-not-allowed disabled:bg-opacity-50`}
        placeholder="Caption (optional)"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
      <SubmitButton updateConvo={updateConvo} edit={edit} pending={loading} />
    </form>
  );
};
