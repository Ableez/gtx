import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const data = [
  {
    icon: "/secure_feature.svg",
    title: "Secure & Safe 💯",
    desc: "Great exchange assures you Safety, Security, and Transparency when trading your Digital assets with us with",
  },
  {
    icon: "/satisfaction.svg",
    title: "Customer Interaction & Satisfaction 🙂",
    desc: 'At Great Exchange you reserve the right to a great trading experience. "Our customers, our success" its what we believe in.',
  },
  {
    icon: "/rates.svg",
    title: "Great Rates & Swift Payout 🏃💨",
    desc: " Definitely our rates for all Giftcards and cryptocurrencies are high not leaving out our fast payment system",
  },
];

const renderUI = data.map((feat, idx) => {
  return (
    <Card
      key={idx}
      className="grid justify-center align-middle place-items-center max-w-sm"
    >
      <CardHeader className="justify-center grid place-items-center gap-2">
        <Image src={feat.icon} alt={feat.title} width={60} height={60} />
        <CardTitle className="text-xl">{feat.title}</CardTitle>
      </CardHeader>
      {/* <h4 className="text-lg font-extrabold"></h4> */}
      <CardContent className="text-neutral-600 dark:text-neutral-500">
        {feat.desc}
      </CardContent>
      {/* <p></p> */}
    </Card>
  );
});

const Features = () => {
  return (
    <section className="my-24">
      <h4 className="md:text-4xl text-2xl font-extrabold px-4 pb-4 relative w-fit mx-auto mb-4">
        Benefits of trading with us
        <div className="bg-secondary p-0.5 w-1/5  absolute bottom-1 rounded-full left-1/2 -translate-x-1/2" />
      </h4>

      <div className="md:flex grid grid-flow-row align-top md:justify-between place-items-center justify-center gap-12 max-w-screen-lg mx-auto px-4 py-8">
        {renderUI}
      </div>
    </section>
  );
};

export default Features;
