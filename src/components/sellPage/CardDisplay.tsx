import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  filteredCards: {
    id: string;
    popular: boolean;
    name: string;
    image: string;
    title: string;
    category: string;
    subcategory: {
      value: string;
      currency: string;
      image: string;
      country: string;
    }[];
  }[];
};

const CardDisplay = ({ filteredCards }: Props) => {
  return (
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
  );
};

export default CardDisplay;
