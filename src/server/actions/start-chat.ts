"use server";

import { api } from "@/trpc/server";
import { ChatType } from "../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 } from "uuid";

export const startChat = async ({
  type,
  assetId,
  amountInCURRENCY,
  currency,
}: {
  type: ChatType;
  assetId: string;
  amountInCURRENCY: string;
  currency: "NGN" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY";
}) => {
  const user = await currentUser();

  const chatId = v4();

  if (!user) {
    return { error: "User not found" };
  }

  const userId = user.id;

  try {
    const newTrade = await api.trade.create({
      userId,
      assetId,
      amountInCURRENCY,
      currency,
      chatId: chatId,
    });

    if (!newTrade) {
      return { error: "Unable to start chat" };
    }

    const newChat = await api.chat.create({
      type,
      assetId,
      userId,
      chatId,
      tradeId: newTrade.id,
    });

    return { data: newChat };
  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]:[START_CHAT]", error);
    return { error: "Failed to start chat" };
  }
};
