import { CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import { CardDetails, Conversation } from "../../../../chat";
import Text from "../../chat/bubbles/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import SetRateComp from "./setRateDialog";
import StartAdminTransaction from "./StartTransaction";
import { formatTime } from "@/lib/utils/formatTime";
import FinishTransaction from "./FinishTransaction";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import useScrollRef from "@/lib/hooks/useScrollRef";
import CardComponent from "@/components/chat/bubbles/card_comp";
import AdminCardMessages from "./AdminCardMessages";
import ImageBubble from "@/components/chat/bubbles/image";
import ImagesCarousel from "@/components/chat/ImagesCarousel";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";

type Props = {
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  card: CardDetails;
};

const AdminRenderMessages = memo(function AdminRenderMessages({
  card,
  chatId,
  scrollToBottom,
}: Props) {
  const [openStartTransaction, setOpenStartTransaction] = useState(false);
  const [finishTransaction, setFinishTransaction] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resend, setResend] = useState(false);
  const [update, setUpdate] = useState({
    status: "",
  });
  const [openSlide, setOpenSlide] = useState(false);
  const [currId, setCurrId] = useState<string>("");

  const { conversation } = adminCurrConversationStore();

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1800);
  }, [copied]);

  const renderUI = conversation?.messages.map((message, idx) => {
    if (
      message.type === "text" &&
      message.content.text !== "" &&
      message.content.media.text !== "" &&
      message.content.media.caption !== ""
    ) {
      return <Text message={message} idx={idx} key={idx} />;
    }

    if (message.type === "card") {
      return (
        <AdminCardMessages
          setCopied={setCopied}
          key={idx}
          idx={idx}
          setResend={setResend}
          setUpdate={setUpdate}
          setOpenRate={setOpenRate}
          message={message}
          setOpenStartTransaction={setOpenStartTransaction}
          setFinishTransaction={setFinishTransaction}
          copied={copied}
        />
      );
    }

    if (message.type === "media" && message.content.media.url) {
      return (
        <ImageBubble
          message={message}
          setCurrId={setCurrId}
          setOpenSlide={setOpenSlide}
          key={idx}
          scrollToBottom={scrollToBottom}
        />
      );
    }
  });

  return (
    <>
      <div className="grid gap-1.5">{renderUI}</div>
      <ImagesCarousel
        conversation={conversation as Conversation}
        openSlide={openSlide}
        setOpenSlide={setOpenSlide}
        currId={currId}
      />
      <StartAdminTransaction
        openStartTransaction={openStartTransaction}
        setOpenStartTransaction={setOpenStartTransaction}
        card={conversation}
        chatId={chatId}
        resend={resend}
        update={update}
      />
      <FinishTransaction
        finishTransaction={finishTransaction}
        setFinishTransaction={setFinishTransaction}
        card={conversation}
        chatId={chatId}
        resend={resend}
        update={update}
      />
      <SetRateComp
        card={card}
        chatId={chatId}
        edit={true}
        openRate={openRate}
        setOpenRate={setOpenRate}
      />
    </>
  );
});

export default AdminRenderMessages;
