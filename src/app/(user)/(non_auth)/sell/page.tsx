"use client";
import SearchBar from "@/components/sellPage/SearchBar";
import React, { useState } from "react";
import { giftcards } from "@/lib/data/giftcards";
import CardDisplay from "@/components/sellPage/CardDisplay";
import { Pagination } from "@/lib/utils/paginate";
import { GiftCard } from "../../../../../types";
import Paginate from "@/components/sellPage/Paginate";

const SellPage = () => {
  const [tabTitle, setTabTitle] = useState("mostpopular");
  const cards = new Pagination(giftcards, 20, 1);

  const currCards = () => {
    if (tabTitle === "mostpopular") {
      return giftcards.filter((card) => card.popular);
    }

    return cards.getCurrentPageData();
  };

  return (
    <div className="pb-8">
      <SearchBar setTabTitle={setTabTitle} tabTitle={tabTitle} />

      {currCards().length > 0 ? (
        <CardDisplay filteredCards={currCards() as GiftCard[]} />
      ) : (
        <div className="text-xl text-center p-8 my-16 font-semibold text-neutral-300">
          Errrm, seems like we dont know that one!
        </div>
      )}
      {tabTitle !== "mostpopular" && <Paginate />}
      <div className="bg-neutral-100 dark:bg-neutral-800 w-full px-8 py-10 place-items-center grid text-sm text-left border-t">
        <div className="max-w-screen-lg mx-auto">
          <h4 className="font-bold text-neutral-500 w-full">
            Beware of gift card scams. Do not share your code.
          </h4>
          <p className="my-4 text-neutral-400 text-[12px] leading-4">
            Protecting Your Gift Card: To safeguard your gift card from fraud,
            we recommend treating it like cash. Keep the card&apos;s details
            confidential and never share them online or over the phone. Only
            purchase cards from authorized retailers and verify the card&apos;s
            value upon purchase. Our Commitment to Privacy: As a company, we
            prioritize your card&apos;s privacy. We do not request sensitive
            information over the phone or via email. We will only ask for your
            card&apos;s PIN when we are ready to process your transaction. Be
            cautious of anyone claiming to represent our company who asks for
            this information. Remember, your gift card&apos;s security is in
            your hands. Stay vigilant to enjoy a worry-free gifting experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
