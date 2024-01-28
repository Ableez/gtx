import React from "react";
import styles from "@/css/hero.module.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type Props = {};

const Hero = (props: Props) => {
  return (
    <section
      className="dark:bg-neutral-800 bg-pink-100 container"
      style={{
        background:
          "linear-gradient(228deg, #FFF1F8 -0.6%, #FFF1F8 24.35%, #FFE5F2 49.3%, #FFD5EA 74.25%, #FFD8EC 99.2%) border-2",
      }}
    >
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8099] to-[#d889fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="max-w-screen-lg mx-auto text-center md:text-left overflow-clip justify-center gap-12 md:gap-8 md:py-16 py-24 grid grid-flow-row md:grid-flow-col h-[160vh] md:h-screen md">
        <div className="mx-auto h-fit">
          <div>
            <span
              className={`${styles.header} py-16 md:text-[3.8em] font-black text-[2.5rem]`}
            >
              Sell Gift Cards & Crypto Currencies for Instant Cash.
            </span>

            <p className="py-8 text-sm text-neutral-600 dark:text-neutral-400 para">
              Great Exchange provides effortless means of trading all Giftcards
              and Cryptocurrencies
            </p>
          </div>
          <Link
            className="cursor-pointer py-3 px-8 rounded-full font-medium text-lg flex align-middle justify-center gap-3 hover:gap-5 duration-300 bg-primary w-full mx-auto md:mx-0 md:w-1/3 ring-4 ring-transparent hover:ring-pink-300 text-white"
            href={"/sell"}
          >
            Get Started <ArrowRightIcon width={20} />
          </Link>
        </div>
        <div className="h-fit place-items-center grid">
          <Image
            alt="phone mockup"
            width={390}
            height={390}
            src={"/phone.png"}
            className="w-[70vw]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
