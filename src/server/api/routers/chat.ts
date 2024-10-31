import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { chat, message, trade } from "@/server/db/schema";

// Input validation schemas
const ChatSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["TRADE", "SUPPORT", "GENERAL"]),
  userId: z.string(),
  assetId: z.string().uuid().optional(),
  chatId: z.string().uuid().optional(),
  tradeId: z.string().uuid().optional(),
  lastMessageId: z.string().uuid().optional(),
  currency: z
    .enum(["NGN", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"])
    .optional(),
  amount: z.number().optional(),
});

export const chatRouter = createTRPCRouter({
  // Get chats by user ID
  getChatsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Ensure user can only access their own chats
        if (ctx.userId !== input.userId) {
          throw new Error("Unauthorized: Can only access your own chats");
        }

        const userChats = await ctx.db.query.chat.findMany({
          where: eq(chat.userId, input.userId),
          with: {
            messages: true,
            lastMessage: true,
            user: true,
            asset: true,
          },
          orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
        });

        return userChats;
      } catch (error) {
        console.error("[GET_USER_CHATS_ERROR]", error);
        throw new Error("Failed to fetch user chats");
      }
    }),

  // Get single chat by ID
  getChatById: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const singleChat = await ctx.db.query.chat.findFirst({
          where: eq(chat.id, input.chatId),
          with: {
            messages: {
              orderBy: (messages, { asc }) => [asc(messages.createdAt)],
            },
            lastMessage: true,
            user: true,
            asset: true,
          },
        });

        if (!singleChat) {
          throw new Error("Chat not found");
        }

        // Ensure user has access to this chat
        if (singleChat.userId !== ctx.userId) {
          throw new Error("Unauthorized: Cannot access this chat");
        }

        return singleChat;
      } catch (error) {
        console.error("[GET_CHAT_BY_ID_ERROR]", error);
        throw new Error("Failed to fetch chat");
      }
    }),

  // Get chat by trade ID
  getChatByTrade: protectedProcedure
    .input(z.object({ tradeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const tradeData = await ctx.db.query.trade.findFirst({
          where: eq(trade.id, input.tradeId),
          with: {
            chat: {
              with: {
                messages: {
                  orderBy: (messages, { asc }) => [asc(messages.createdAt)],
                },
                lastMessage: true,
                user: true,
                asset: true,
              },
            },
          },
        });

        if (!tradeData?.chat) {
          throw new Error("Chat not found for this trade");
        }

        // Ensure user has access to this trade's chat
        if (tradeData.userId !== ctx.userId) {
          throw new Error("Unauthorized: Cannot access this trade's chat");
        }

        return tradeData.chat;
      } catch (error) {
        console.error("[GET_CHAT_BY_TRADE_ERROR]", error);
        throw new Error("Failed to fetch trade chat");
      }
    }),

  // Create new chat
  create: protectedProcedure
    .input(ChatSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure user can only create chats for themselves
        if (ctx.userId !== input.userId) {
          throw new Error("Unauthorized: Can only create chats for yourself");
        }

        const newChat = await ctx.db
          .insert(chat)
          .values({
            type: input.type,
            userId: input.userId,
            assetId: input.assetId,
            lastMessageId: input.lastMessageId,
            id: input.id,
            tradeId: input.tradeId,
          })
          .returning();

        if (!newChat[0]) {
          return { error: "Unable to start chat" };
        }

        return newChat[0];
      } catch (error) {
        console.error("[CREATE_CHAT_ERROR]", error);
        throw new Error("Failed to create chat");
      }
    }),

  // Update chat
  update: protectedProcedure
    .input(
      ChatSchema.extend({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if chat exists and belongs to user
        const existingChat = await ctx.db.query.chat.findFirst({
          where: eq(chat.id, input.id),
        });

        if (!existingChat) {
          throw new Error("Chat not found");
        }

        if (existingChat.userId !== ctx.userId) {
          throw new Error("Unauthorized: Cannot update this chat");
        }

        const updatedChat = await ctx.db
          .update(chat)
          .set({
            type: input.type,
            userId: input.userId,
            assetId: input.assetId,
            lastMessageId: input.lastMessageId,
            updatedAt: new Date(),
          })
          .where(eq(chat.id, input.id))
          .returning();

        return updatedChat[0];
      } catch (error) {
        console.error("[UPDATE_CHAT_ERROR]", error);
        throw new Error("Failed to update chat");
      }
    }),

  // Delete chat
  delete: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if chat exists and belongs to user
        const existingChat = await ctx.db.query.chat.findFirst({
          where: eq(chat.id, input.chatId),
        });

        if (!existingChat) {
          throw new Error("Chat not found");
        }

        if (existingChat.userId !== ctx.userId) {
          throw new Error("Unauthorized: Cannot delete this chat");
        }

        // First, delete all messages in the chat
        await ctx.db.delete(message).where(eq(message.chatId, input.chatId));

        // Then delete the chat itself
        const deletedChat = await ctx.db
          .delete(chat)
          .where(eq(chat.id, input.chatId))
          .returning();

        return deletedChat[0];
      } catch (error) {
        console.error("[DELETE_CHAT_ERROR]", error);
        throw new Error("Failed to delete chat");
      }
    }),

  // Get recent chats for user
  getRecentChats: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Ensure user can only access their own recent chats
        if (ctx.userId !== input.userId) {
          throw new Error("Unauthorized: Can only access your own chats");
        }

        const recentChats = await ctx.db.query.chat.findMany({
          where: eq(chat.userId, input.userId),
          with: {
            messages: {
              limit: 1,
              orderBy: (messages, { desc }) => [desc(messages.createdAt)],
            },
            lastMessage: true,
            user: true,
            asset: true,
          },
          limit: input.limit,
          orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
        });

        return recentChats;
      } catch (error) {
        console.error("[GET_RECENT_CHATS_ERROR]", error);
        throw new Error("Failed to fetch recent chats");
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        text: z.string(),
        type: z.enum(["STANDARD", "CARD"]).optional(),
        mediaId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify chat access
        const chatData = await ctx.db.query.chat.findFirst({
          where: eq(chat.id, input.chatId),
        });

        if (!chatData) {
          throw new Error("Chat not found");
        }

        if (chatData.userId !== ctx.userId) {
          throw new Error("Unauthorized: Cannot send message to this chat");
        }

        // Insert new message
        const newMessage = await ctx.db
          .insert(message)
          .values({
            chatId: input.chatId,
            text: input.text,
            type: input.type || "STANDARD",
            mediaId: input.mediaId,
            sender: ctx.userId,
          })
          .returning();

        // Update chat's lastMessageId
        await ctx.db
          .update(chat)
          .set({
            lastMessageId: newMessage[0]?.id,
            updatedAt: new Date(),
          })
          .where(eq(chat.id, input.chatId));

        return newMessage[0];
      } catch (error) {
        console.error("[SEND_MESSAGE_ERROR]", error);
        throw new Error("Failed to send message");
      }
    }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const messageData = await ctx.db.query.message.findFirst({
          where: eq(message.id, input.messageId),
        });

        if (!messageData) {
          throw new Error("Message not found");
        }

        const deletedMessage = await ctx.db
          .update(message)
          .set({
            deleted: true,
            deletedAt: new Date(),
          })
          .where(eq(message.id, input.messageId))
          .returning();

        return deletedMessage[0];
      } catch (error) {
        console.error("[DELETE_MESSAGE_ERROR]", error);
        throw new Error("Failed to delete message");
      }
    }),
});
