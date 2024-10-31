import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { trade } from "@/server/db/schema";

export const tradeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        assetId: z.string().uuid(),
        amountInCURRENCY: z.string(),
        currency: z.enum(["NGN", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"]),
        chatId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newTrade = await ctx.db
          .insert(trade)
          .values({
            userId: input.userId,
            assetId: input.assetId,
            amountInCURRENCY: input.amountInCURRENCY,
            currency: input.currency,
            status: "PENDING",
            chatId: input.chatId,
          })
          .returning();

        return newTrade[0] ?? null;
      } catch (error) {
        console.error("[CREATE_TRADE_ERROR]", error);
        throw new Error("Failed to create trade");
      }
    }),
});
