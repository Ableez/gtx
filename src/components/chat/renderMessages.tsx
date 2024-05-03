import React, { memo, useState } from "react";
import { CardDetails, Conversation } from "../../../chat";
import TextMessage from "./bubbles/text";
import CardMessage from "./bubbles/card";
import ImagesCarousel from "./ImagesCarousel";
import { useMessagesStore } from "@/lib/utils/store/userConversation";
import ImageBubble from "./bubbles/image";

type Props = {
  data: Conversation;
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  card: CardDetails;
};

const RenderMessages = memo(function RenderMessages({
  data,
  chatId,
  card,
  scrollToBottom,
}: Props) {
  const [openSlide, setOpenSlide] = useState(false);
  const [currId, setCurrId] = useState<string>("");
  const { conversation } = useMessagesStore();

  const renderUI = data.messages.map((message, idx) => {
    if (message.type === "text") {
      return <TextMessage idx={idx} message={message} key={idx} />;
    }

    if (message.type === "card") {
      return (
        <CardMessage
          scrollToBottom={scrollToBottom}
          card={card}
          data={data}
          chatId={chatId}
          idx={idx}
          message={message}
          key={idx}
        />
      );
    }

    if (message.type === "media" && message.content.media?.url !== "") {
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
    </>
  );
});

export default RenderMessages;
