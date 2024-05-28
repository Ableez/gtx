import Image from "next/image";
import React from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap"; // import {} from "gsap"
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const CardDeck = (props: Props) => {
  const cardDeck1 = ["nord-d.png", "target-d.png", "nike-d.png"];
  const cardDeck2 = ["sbux-d.png", "sephora-d.png", "ama-d.png"];

  useGSAP(() => {
    gsap.to(".leff_card", {
      scrollTrigger: {
        trigger: ".left__cards__cont",
        start: "-=500px +=700px", // when the top of the trigger hits the top of the viewport
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      right: "55%",
      ease: "power3.inOut",
    });
    gsap.to(".rii_card", {
      scrollTrigger: {
        trigger: ".left__cards__cont",
        start: "-=500px +=700px", // when the top of the trigger hits the top of the viewport
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      left: "55%",
      ease: "power3.inOut",
    });
  });

  return (
    <div className="my-32 overflow-hidden">
      <div className="mb-8">
        <h4 className="text-2xl md:text-4xl font-black leff_card">
          Greatex Crypto
        </h4>
      </div>
      <div className="flex align-middle justify-center place-items-center relative left__cards__cont">
        <div className="flex flex-col items-center absolute top-1/2 -translate-y-1/2 scale-[1.4] leff_card">
          {cardDeck1.map((img, idx) => {
            return (
              <Image
                src={`/parallax/${img}`}
                key={idx}
                alt="Card"
                width={200}
                height={200}
                className={`shadow-sm w-[8rem] md:w-[10rem] ${
                  idx == 2
                    ? "rotate-[-30deg]"
                    : idx == 0
                    ? "rotate-[30deg]"
                    : ""
                }`}
              />
            );
          })}
        </div>
        <Image
          src={"/phone_frame.png"}
          alt="Phone"
          width={399}
          height={786}
          className="max-w-[20rem] w-[18rem] md:w-[22rem] z-[40]"
        />
        <div className="flex flex-col items-center absolute top-1/2 -translate-y-1/2 scale-[1.4] rii_card">
          {cardDeck2.map((img, idx) => {
            return (
              <Image
                src={`/parallax/${img}`}
                key={idx}
                alt="Card"
                width={200}
                height={200}
                className={`shadow-sm w-[8rem] md:w-[10rem] ${
                  idx == 2
                    ? "rotate-[30deg]"
                    : idx == 0
                    ? "rotate-[-30deg]"
                    : ""
                }`}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-8 max-w-sm mx-auto px-8">
        <h4 className="text-">
          Coming soon. Greatex will also allow you to trade in your crypto
          currencies for cash.
        </h4>
      </div>
    </div>
  );
};

export default CardDeck;
