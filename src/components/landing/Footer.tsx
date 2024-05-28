import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div
      className="my-8 md:p-16 p-4 bg-pink-50 grid gap-6"
      style={{
        backgroundImage: `url("/gtx_footer_bg.svg")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "70%",
      }}
    >
      <div className="w-full grid grid-flow-row md:grid-flow-col md:grid-cols-3 gap-6">
        <div className="p-8 flex flex-col gap-6 align-middle place-items-start justify-center bg-white rounded-3xl text-black/80">
          <h4 className="md:text-[3rem] text-2xl font-bold text-left md:leading-[3.2rem]">
            Every transaction matters.
          </h4>
          <div className="flex align-middle place-items-center justify-center gap-2">
            <Image src={"/gtx_logo.svg"} alt="Logo" width={30} height={30} />
            <h4 className="font-semibold text-lg">Greatex</h4>
          </div>
          <div>
            <p className="text-sm text-left">
              © 2024 All Rights Reserved, Great Exchange.
            </p>
          </div>
        </div>
        <div className="p-8 flex flex-col gap-6 align-middle place-items-start justify-center bg-white rounded-3xl text-black/80">
          <h4 className="text-xl font-bold text-left leading-[3.2rem]">
            Support
          </h4>
          <div>
            <p className="text-sm text-left">
              Have questions?{" "}
              <Link
                className="font-semibold border-b-2 border-neutral-300 hover:border-primary py-0.5 duration-300"
                href={"mailto:djayableez@gmail.com"}
              >
                Get in touch
              </Link>{" "}
              or check out our{" "}
              <Link
                className="font-semibold border-b-2 border-neutral-300 hover:border-primary py-0.5 duration-300"
                href={"/support"}
              >
                Help Center
              </Link>
            </p>
          </div>
          <div>
            <p className="text-sm text-left">
              You can also text our support team at{" "}
              <Link href="tel:+2348103418286">0810 341 8286</Link> or email us
              at{" "}
              <Link
                className="font-semibold border-b-2 border-neutral-300 hover:border-primary py-0.5 duration-300"
                href={"mailto:help@greatexchange.com"}
              >
                help@greatexchange.com
              </Link>
            </p>
          </div>
        </div>
        <div className="p-8 flex flex-col align-middle place-items-center justify-center bg-white rounded-3xl text-black/80 md:hidden">
          <h4 className="text-xl font-bold leading-[3.2rem] text-center">
            Social
          </h4>
          <div className="flex flex-row gap-5 align-middle place-items-center justify-center text-4xl">
            <Link href={"https://twitter.com/greatexchange"}>
              <BsTwitterX />
            </Link>
            <Link href={"https://twitter.com/greatexchange"}>
              <FaFacebook />
            </Link>
            <Link href={"https://twitter.com/greatexchange"}>
              <LuInstagram />
            </Link>
          </div>
        </div>
        <div className="p-8 flex flex-col align-middle place-items-center justify-center bg-white rounded-3xl text-black/80 gap-3">
          <Link href={"/terms"} className="font-semibold text-sm">
            Terms of use
          </Link>
          <Link href={"/terms"} className="font-semibold text-sm">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="p-8 md:flex flex-col align-middle place-items-center justify-center bg-white rounded-3xl text-black/80 hidden gap-3">
        <h4 className="text-xl font-bold leading-[3.2rem] text-center">
          Social
        </h4>
        <div className="flex flex-row gap-5 align-middle place-items-center justify-center text-4xl py-2">
          <Link className="hover:scale-110 duration-300" href={"https://twitter.com/greatexchange"}>
            <BsTwitterX />
          </Link>
          <Link className="hover:scale-110 duration-300" href={"https://twitter.com/greatexchange"}>
            <FaFacebook />
          </Link>
          <Link className="hover:scale-110 duration-300" href={"https://twitter.com/greatexchange"}>
            <LuInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
