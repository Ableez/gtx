import Image from "next/image";
import React from "react";

const Features = () => {
  return (
    <section className="my-24">
      <h4 className="md:text-4xl text-2xl font-bold md:px-4 pb-4 relative w-fit mx-auto mb-4">        Benefits of trading with us
        <div className="bg-secondary p-0.5 w-1/5  absolute bottom-1 rounded-full left-1/2 -translate-x-1/2" />
      </h4>

      <div className="md:flex grid grid-flow-row align-top justify-between place-items-start gap-6  max-w-screen-lg mx-auto px-4">
        <div className="place-items-center text-center">
          <div className="p-6">
            <Image
              className="mx-auto p-3 mb-6"
              width={80}
              height={80}
              src={"/secure_feature.svg"}
              alt="secure"
            />
            <h4 className="font-bold text-xl w-2/3 md:w-full mx-auto mb-1">
              Secure & Safe 💯
            </h4>
          </div>
          <p className="text-black text-opacity-60 text-sm md:text-base para dark:text-neutral-400 w-3/4 md:w-full mx-auto">
            Great exchange assures you Safety, Security, and Transparency when
            trading your Digital assets with us with
          </p>
        </div>
        <div className="place-items-center text-center">
          <div className="p-6">
            <Image
              className="mx-auto p-3 mb-6"
              width={80}
              height={80}
              src={"/satisfaction.svg"}
              alt="secure"
            />
            <h4 className="font-bold text-xl w-2/3 md:w-full mx-auto mb-1">
              Customer Interaction & Satisfaction 🙂
            </h4>
          </div>
          <p className="text-black text-opacity-60 text-sm para dark:text-neutral-400 w-3/4 mx-auto md:text-base">
            All customers at Great Exchange has the right and access to a great
            trading experience Our customer is our success
          </p>
        </div>
        <div className="place-items-center text-center">
          <div className="p-6">
            <Image
              className="mx-auto p-3 mb-6"
              width={80}
              height={50}
              src={"/rates.svg"}
              alt="secure"
            />
            <h4 className="font-bold text-xl w-2/3 md:w-full mx-auto mb-1">
              Great Rates & Swift Payout 🏃💨
            </h4>
          </div>
          <p className="text-black text-opacity-60 text-sm para dark:text-neutral-400 w-3/4 md:w-full mx-auto md:text-base">
            Definitely our rates for all Giftcards and cryptocurrencies are high
            not leaving out our fast payment system
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
