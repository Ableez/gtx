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

  const toShow = giftcards.filter((t) => {
    return tabTitle === "mostpopular" ? t.popular : t;
  });
  const filteredCards = toShow.filter((t) => {
    return t.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  });
  return (
    <div className="container">
      {/* Search Bar */}
      <SearchBar val={searchTerm} change={setSearchTerm} />
      {/* <CardsTabs /> */}

      <div className="my-4 gap-2 flex">
        {tabs.map((tab, idx) => {
          return (
            <Button
              className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
                tabTitle === tab.link
                  ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                  : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white"
              }`}
              onClick={() => setTabTitle(tab.link)}
              key={idx}
            >
              {tab.title}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-7 duration-200">
        {filteredCards.map((giftCard, idx) => {
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
        })}
      </div>
    </div>
  );
};

export default SellPage;
