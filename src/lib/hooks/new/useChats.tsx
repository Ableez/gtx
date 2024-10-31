// hooks/useRealtimeChat.ts
"use client";
import { useEffect, useState } from "react";
import { MessageWithRelations } from "@/server/db/schema";
import { supabase } from "@/lib/utils/supabase/client";
import { useSession } from "@clerk/nextjs";
import { api } from "@/trpc/react";

export function useChatSession(chatId: string) {
  const [messages, setMessages] = useState<MessageWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  // TRPC query for initial messages
  const { data: initialMessages } = api.chat.getChatById.useQuery(
    { chatId },
    { enabled: !!chatId }
  );

  const utils = api.useUtils();

  useEffect(() => {
    if (initialMessages?.messages) {
      setMessages(initialMessages.messages);
      setIsLoading(false);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!chatId || !session?.user?.id) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "greatex_message",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as MessageWithRelations;
            setMessages((prev) => [...prev, newMessage]);
            // Invalidate queries to refresh chat list
            await utils.chat.getRecentChats.invalidate();
          }
          if (payload.eventType === "DELETE") {
            const deletedMessageId = payload.old.id;
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== deletedMessageId)
            );
          }
          if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new as MessageWithRelations;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, session?.user?.id, utils]);

  // Send message function
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getChatById.invalidate({ chatId });
      utils.chat.getRecentChats.invalidate();
    },
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    isError: sendMessage.isError,
    error: sendMessage.error,
  };
}
