import { api } from "@/trpc/server";
import React from "react";
import AllGiftcard from "./_components/all-giftcards";
import { AssetSelect } from "@/server/db/schema";

const SellPage = async () => {
  const giftcards = (await api.giftcard.getAllCards()) as AssetSelect[];

  if (!giftcards) {
    return (
      <div className={"h-[60dvh] grid place-items-center justify-center"}>
        We have no cards to show
      </div>
    );
  }

  return (
    <div>
      <AllGiftcard cards={giftcards} />
    </div>
  );
};

export default SellPage;
