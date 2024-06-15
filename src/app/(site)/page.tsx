"use client";

import Features from "@/components/landing/Features";
import ScrollHero from "@/components/landing/scroll-hero";
import { InfiniteMovingCards } from "@/components/landing/moving-cards";
import CardDeck from "@/components/landing/card-deck";
import ReadyNow from "@/components/landing/ready-to-trade";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const images = [
    "/parallax/adidas.png",
    "/parallax/apple.png",
    "/parallax/banana.png",
    "/parallax/bb.png",
  ];
  const images2 = [
    "/parallax/ebay.jpg",
    "/parallax/footlocker.png",
    "/parallax/gp.png",
    "/parallax/sbux.png",
    "/parallax/target.png",
  ];

  return (
    <main className="text-center bg-white text-black">
      <ScrollHero />
      <Features />
      <div className="flex justify-center items-center place-items-center p-4 gap-4">
        <InfiniteMovingCards speed="fast" items={images} pauseOnHover={false} />
        <InfiniteMovingCards
          items={images2}
          speed="normal"
          direction="right"
          pauseOnHover={false}
        />
      </div>
      <CardDeck />
      <ReadyNow />
      <Footer />
    </main>
  );
}
