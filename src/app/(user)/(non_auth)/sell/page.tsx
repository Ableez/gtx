"use client";
import SearchBar from "@/components/sellPage/SearchBar";
import React, { useEffect, useState } from "react";
import { giftcards } from "@/lib/data/giftcards";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const tabs: { title: string; link: string }[] = [
  {
    title: "Most Popular",
    link: "mostpopular",
  },
  {
    title: "All",
    link: "all",
  },
];

enum TabType {
  "mostpopular",
  "all",
}

const SellPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabTitle, setTabTitle] = useState("mostpopular");

  const toShow = giftcards.filter((t) => {
    if (searchTerm.length === 0) {
      return tabTitle === "mostpopular" ? t.popular : t;
    } else {
      return t;
    }
  });

  const filteredCards = toShow.filter((t) => {
    return t.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  });

  return (
    <div className="pb-8">
      <SearchBar
        tabTitle={tabTitle}
        setTabTitle={setTabTitle}
        tabs={tabs}
        val={searchTerm}
        change={setSearchTerm}
      />
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-7 duration-200 container">
          {filteredCards.map((giftCard, idx) => {
            return (
              <Link
                href={`/sell/${giftCard.id}`}
                key={idx}
                className="p-3 bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] grid place-items-center gap-4 active:border-slate-300 dark:active:border-slate-600  active:bg-slate-50 border duration-100 border-neutral-200 hover:border-neutral-300 dark:border-neutral-700"
              >
                <Image
                  src={giftCard.image}
                  width={58}
                  height={58}
                  alt="Vender Logo"
                  className="text-xs"
                  priority={true}
                />
                <h4 className="text-xs text-neutral-800 dark:text-white text-center">
                  {giftCard.name}
                </h4>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-xl text-center p-8 my-16 font-semibold text-neutral-400">
          You caught us on that one. We dont know that one!
        </div>
      )}

      <div className="bg-neutral-100 dark:bg-neutral-800 w-full px-8 py-8 place-items-center grid text-sm text-left">
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
