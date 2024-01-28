import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type Props = {};

const ServiceDetail = (props: Props) => {
  return (
    <div>
      <section className="bg-pink-100 text-left dark:bg-neutral-900 py-24 px-8 md:px-16">
        <div className="grid max-w-screen-lg mx-auto md:gap-8 xl:gap-0 md:grid-cols-12 gap-[5em]">
          <div className="md:justify-self-end justify-self-start md:mt-0 md:col-span-5 md:flex">
            <Image
              width={200}
              height={400}
              src="/bnscards.png"
              alt="mockup"
              className="rounded-2xl w-screen md:min-w-full"
            />
          </div>
          <div className="md:place-self-center place-self-start md:col-span-7 md:ml-6">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white text-center md:text-left ">
              Exchange Giftcards
            </h1>
            <p className="max-w-xl mb-8 font-light text-neutral-500 md:mb-8  dark:text-neutral-400 mt-4 para text-center md:text-left">
              Great Exchange offers you a secure way to trade your gift cards to
              physical cash giving you detailed guides lines and great rates.
            </p>
            <Link
              className="cursor-pointer mt-12 py-3 px-8 rounded-full font-medium text-lg flex align-middle justify-center gap-3 hover:gap-5 duration-300 bg-primary w-2/3 mx-auto md:w-2/4 md:mx-0 ring-4 ring-transparent  hover:ring-pink-300 text-white"
              href={"/sell"}
            >
              Get Started <ArrowRightIcon width={20} />
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white text-left dark:bg-neutral-800 py-24 px-8 md:px-16">
        <div className="grid max-w-screen-lg mx-auto md:gap-8 xl:gap-0 md:grid-cols-12 gap-[5em]">
          <div className="md:justify-self-end justify-self-start md:mt-0 md:col-span-5 md:flex md:order-1 -order-last">
            <Image
              width={200}
              height={400}
              src="/bnsbitcoin.png"
              alt="mockup"
              className="rounded-2xl w-screen md:min-w-full"
            />
          </div>
          <div className="md:place-self-center place-self-start md:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white text-center md:text-left">
              Buy & Sell Bitcoin
            </h1>
            <p className="max-w-xl mb-6 font-light text-neutral-500 md:mb-8  dark:text-neutral-400 my-12 para text-center md:text-left">
              Crypto Currency is the future of money, and it is already becoming
              the world&apos;s leading industry in terms of market capital, that
              is why we at Geat Exchange are offering you a great means to trade
              your Crypto Currencies.
            </p>
            <Link
              className="cursor-pointer mt-12 py-3 px-8 rounded-full font-medium text-lg flex align-middle justify-center gap-3 hover:gap-5 duration-300 bg-primary w-2/3 mx-auto md:w-2/4 md:mx-0 ring-4 ring-transparent  hover:ring-pink-300 text-white"
              href={"/sell"}
            >
              Get Started <ArrowRightIcon width={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
