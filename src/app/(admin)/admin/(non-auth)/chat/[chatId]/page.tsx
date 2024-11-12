"use client";
import React, { useEffect } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/utils/supabase/client";
import { MessageWithRelations } from "@/server/db/schema";
import { useChatStore } from "@/lib/stores/chat-store";
import { useChatSession } from "@/lib/hooks/new/useChats";
import ChatScreen from "./_components/admin-chat-screen";
import { useAtom } from "jotai";
import { adminPresenceAtom } from "@/lib/stores/admin-presence-store";

type Props = {
  params: { chatId: string };
};

export type PresenceUser = {
  userId: string;
  username?: string;
  avatarUrl?: string;
  onlineAt: string;
  isAdmin: boolean;
};

const AdminChatPage = ({ params }: Props) => {
  const { session } = useSession();
  const { addMessage, getMessage, updateMessage } = useChatStore();
  const { chat, trade } = useChatSession(params.chatId);
  const { user } = useUser();
  const [_activeUsers, setActiveUsers] = useAtom(adminPresenceAtom);

  const { chatId } = params;

  useEffect(() => {
    const fn = async () => {
      if (!session?.user?.id || !params.chatId) return;

      console.log("⚙️Setting up Supbase", `chat_messages:${chatId}`);

      const messageChannel = supabase
        .channel(`chat_messages:${chatId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "greatex_message",
            filter: `chat_id=eq.${chatId}`,
          },
          async (payload) => {
            console.log("🔔RLS UPDATE::", payload);
            if (payload.eventType === "INSERT") {
              const newMessage: MessageWithRelations = {
                chatId: payload.new.chat_id,
                contentType: payload.new.content_type,
                createdAt: payload.new.created_at,
                deleted: payload.new.deleted,
                deletedAt: payload.new.deleted_at,
                deletedBy: payload.new.deleted_by,
                id: payload.new.id,
                isAdmin: payload.new.is_admin,
                metadata: payload.new.metadata,
                parentId: payload.new.parent_id,
                senderId: payload.new.sender_id,
                status: payload.new.status,
                text: payload.new.text,
                threadRoot: payload.new.thread_root,
                type: payload.new.type,
                updatedAt: payload.new.updated_at,
                mediaUrl: payload.new.media_url,
              };

              const existingMessage = getMessage(chatId, payload.new.id);

              console.log("🔍Existing message", existingMessage);

              if (existingMessage) {
                updateMessage(chatId, payload.new.id, newMessage);
              } else {
                addMessage(chatId, newMessage);
              }
            }
          }
        )
        .subscribe((status) => {
          console.log(`🔛Supabase status chat ${chatId}:`, status);
        });

      return () => {
        console.log("🗑️Cleaning up Supabase", `chat_messages:${chatId}`);
        supabase.removeChannel(messageChannel);
      };
    };

    fn().catch(console.error);
  }, [
    session?.user?.id,
    chatId,
    session,
    params.chatId,
    addMessage,
    getMessage,
    updateMessage,
  ]);

  useEffect(() => {
    const fn = async () => {
      if (!session?.user?.id || !chatId) return;

      const presenceChannel = supabase
        .channel(`chat_messages:${chatId}:presence`)
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();
          const users = Object.values(
            state
          ).flat() as unknown as PresenceUser[];
          setActiveUsers(users);
        })
        .subscribe();

      // Track presence
      await presenceChannel.track({
        userId: user?.id,
        username: user?.username || user?.emailAddresses[0]?.emailAddress,
        avatarUrl: user?.imageUrl,
        onlineAt: new Date().toISOString(),
        isAdmin: true,
      });

      return () => {
        supabase.removeChannel(presenceChannel);
      };
    };

    fn().catch(console.error);
  }, [chatId, session?.user?.id, user, setActiveUsers]);

  return (
    <div>
      <ChatScreen trade={trade} chat={chat} params={params} />
    </div>
  );
};

export default AdminChatPage;
