"use client";
import SearchBar from "@/components/sellPage/SearchBar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  // const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabTitle, setTabTitle] = useState("mostpopular");

  // Use the imported useClient hook or function here

  const toShow = giftcards.filter((t) => {
    return tabTitle === "mostpopular" ? t.popular : t;
  });
  const filteredCards = toShow.filter((t) => {
    return t.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  });
  return (
    <div>
      {/* Search Bar */}
      <SearchBar
        tabTitle={tabTitle}
        setTabTitle={setTabTitle}
        tabs={tabs}
        val={searchTerm}
        change={setSearchTerm}
      />
      {/* <CardsTabs /> */}

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-7 duration-200 container mb-16">
          {filteredCards.length > 0
            ? filteredCards.map((giftCard, idx) => {
                return (
                  <Link
                    href={`/sell/${giftCard.id}`}
                    key={idx}
                    className="p-3 bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] grid place-items-center gap-4 active:border-slate-300 dark:active:border-slate-600  active:bg-slate-50 border border-transparent duration-100 border-neutral-300 dark:border-neutral-700"
                  >
                    <Image
                      src={"logoplace.svg"}
                      width={58}
                      height={58}
                      alt="Vender Logo"
                      className="dark:opacity-10"
                    />
                    <h4 className="text-xs text-neutral-800 dark:text-white">
                      {giftCard.name}
                    </h4>
                  </Link>
                );
              })
            : null}
        </div>
      ) : (
        <div className="text-xl text-center p-8 my-16 font-semibold text-neutral-400">
          You caught us on that one. We dont know that one!
        </div>
      )}
    </div>
  );
};

export default SellPage;
