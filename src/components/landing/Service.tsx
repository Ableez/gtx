import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type Props = {};

const Service = (props: Props) => {
  return (
    <div className="container border-2 py-32">
      <div className="max-w-screen-lg mx-auto grid gap-4">
        <p
          className="md:text-5xl text-3xl font-bold text-black dark:text-white md:px-16"
          style={{ lineHeight: "1.3" }}
        >
          We Buy Your Gift Cards & Crypto Currencies For Instant Cash.
        </p>
        <p className="text-neutral-500 dark:text-neutral-400 md:px-16 md:text-base text-sm md:w-[50vw] mx-auto leading-6 para">
          We buy Apple iTunes, Google Play, Nordstorm, Steam, Sephora, Amazon,
          Walmart, Visa, American Express and a lot more from various brands and
          countries.
        </p>
      </div>
      <Link
        className="cursor-pointer mt-12 py-3 px-8 rounded-full font-medium text-lg flex align-middle justify-center gap-3 hover:gap-5 duration-300 bg-primary w-2/3 mx-auto md:w-1/3 ring-4 ring-transparent  hover:ring-pink-300 text-white"
        href={"/sell"}
      >
        Get Started <ArrowRightIcon width={20} />
      </Link>
    </div>
  );
};

export default Service;
