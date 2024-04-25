import { postToast } from "@/components/postToast";
import SubmitButton from "./SubmitButton";
import Cookies from "js-cookie";
import { FormEvent, useState } from "react";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import { v4 } from "uuid";
import { usePathname } from "next/navigation";
import { Conversation, Message } from "../../../../../../../chat";
import { Timestamp } from "firebase/firestore";

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
};

const uc = Cookies.get("user");
const user = JSON.parse(uc || "{}");

const IMAGE_NAME = v4();
const URL_REGEX = /\/(?:admin\/)?chat\/(\w+)$/;

export const MessageForm = ({
  loading,
  setCaption,
  imageUrl,
  edit,
  caption,
  setLoading,
  setOpenS,
  owns,
  scrollToBottom,
}: MessageFormProps) => {
  const [progess, setProgress] = useState(0);

  const { updateConversation, conversation } = useMessagesStore();
  const adminConversationStore = adminCurrConversationStore();
  const chatId = usePathname().split("/")[usePathname().split("/").length - 1];

  const sendImageAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      postToast("Error", { description: "Image is required." });
      return;
    }

    setOpenS(false);

    try {
      // if (imageUrl) {
      //   postToast("Warning!", {
      //     description:
      //       "Image size is too big and might take a while to load. Please wait...",
      //   });
      // }

      const metadata = {
        name: IMAGE_NAME,
      };

      const url = `/chatImages/${chatId}/greatexchange.co__${v4()}__${
        user?.uid
      }_${IMAGE_NAME}`;

      const reqParams = {
        image: imageUrl,
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
        // setError("");
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
      // setImage(null);
      // setImgSrc("");
    }
  };

  const updateConvo = () => {
    if (!imageUrl) {
      postToast("Error", { description: "Image is required." });
      return;
    }

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
        data: null,
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
      onSubmit={async (e) => {
        sendImageAction(e);
      }}
      className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-neutral-800 rounded-lg max-w-md mx-auto w-full"
    >
      <input
        id="message"
        name="message"
        disabled={loading}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        autoCorrect="true"
        autoComplete="off"
        className={`font-normal transition-all duration-300 resiL-none leading-4 text-xs md:text-sm antialiased focus:outline-none col-span-10 w-full h-fit p-3 bg-neutral-200 dark:bg-neutral-800 outline-none rounded-l-lg disabled:cursor-not-allowed disabled:bg-opacity-50`}
        placeholder="Caption (optional)"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
      <SubmitButton updateConvo={updateConvo} edit={edit} pending={loading} />
    </form>
  );
};
