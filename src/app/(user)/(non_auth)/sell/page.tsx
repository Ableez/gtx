"use client";
import SearchBar from "@/components/sellPage/SearchBar";
import React, { useEffect, useRef, useState } from "react";
import { giftcards } from "@/lib/data/giftcards";
import CardDisplay from "@/components/sellPage/CardDisplay";
import { Pagination } from "@/lib/utils/paginate";
import { GiftCard } from "../../../../../types";
import Loader from "@/components/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

// const savedPage = parseInt(localStorage.getItem("card_page") || "1");
const savedPage = parseInt(Cookies.get("card_page") || "1");

const SellPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const [tabTitle, setTabTitle] = useState("all");
  const [currPage, setCurrPage] = useState(savedPage);
  const [currCards, setCurrCards] = useState<Pagination>(
    new Pagination(giftcards, 20, currPage)
  );
  const [cardsToShow, setCardsToShow] = useState<GiftCard[] | undefined>(
    currCards?.getCurrentPageData()
  );

  useEffect(() => {
    if (tabTitle === "mostpopular") {
      setCardsToShow(giftcards.filter((card) => card.popular));
    } else {
      setCardsToShow(currCards?.goToPage(currPage));
      localStorage.setItem("card_page", currPage.toString());
      Cookies.set("card_page", currPage.toString());
    }
    container.current?.scrollIntoView({ behavior: "smooth", block:"start" });
  }, [currCards, tabTitle, currPage]);

  return (
    <div className="pb-8 max-w-screen-md mx-auto" ref={container}>
      <SearchBar setTabTitle={setTabTitle} tabTitle={tabTitle} />

      {!currCards || !cardsToShow ? (
        <div className="h-[50vh] grid place-items-center align-middle justify-center">
          <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-2xl dark:shadow-lg dark: shadow-pink-200 dark:shadow-[#43262f60] ">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          {cardsToShow.length > 0 ? (
            <CardDisplay filteredCards={cardsToShow as GiftCard[]} />
          ) : (
            <div className="text-xl text-center p-8 my-16 font-semibold text-neutral-300">
              Errrm, seems like we dont know that one!
            </div>
          )}
          {tabTitle !== "mostpopular" && (
            <div className=" flex align-middle place-items-center justify-center gap-4 w-fit mx-auto mb-4">
              <Button
                variant={"ghost"}
                className="border"
                size={"icon"}
                title="Previous Page"
                disabled={currPage === 1}
                onClick={() => {
                  setCurrPage(currPage - 1);
                }}
              >
                <ChevronLeftIcon width={22} />
              </Button>
              <h4>
                {currPage} / {currCards.getTotalPages()}
              </h4>
              <Button
                variant={"ghost"}
                className="border"
                size={"icon"}
                title="Next Page"
                disabled={currPage === currCards.getTotalPages()}
                onClick={() => {
                  setCurrPage(currPage + 1);
                }}
              >
                <ChevronRightIcon width={22} />
              </Button>
            </div>
          )}
        </>
      )}

      <div className="bg-neutral-100 dark:bg-neutral-800 w-full p-8 place-items-center grid text-sm text-left border-t dark:rounded-2xl">
        <div className="max-w-screen-lg mx-auto">
          <h4 className="font-bold text-neutral-500 w-full">
            Beware of gift card scams. Do not share your code.
          </h4>
          <p className="my-4 text-neutral-400 text-[10px] leading-5">
            Protecting Your Gift Card: To safeguard your gift card from fraud,
            we recommend treating it like cash. Keep the card&apos;s details
            confidential and never share them online or over the phone. Only
            purchase cards from authorized retailers and verify the card&apos;s
            value upon purchase. Our Commitment to Privacy: As a company, we
            prioritize your card&apos;s privacy.{" "}
            <b>
              We do not request sensitive information over the phone or via
              email.
            </b>{" "}
            We will only ask for your card&apos;s PIN when we are ready to
            process your transaction. Be cautious of anyone claiming to
            represent our company who asks for this information. Remember, your
            gift card&apos;s security is in your hands. Stay vigilant to enjoy a
            worry-free exchange experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
