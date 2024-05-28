import Image from "next/image";
import React from "react";

type Props = {};

const Features = (props: Props) => {
  return (
    <div className="mb-14 md:mt-32 grid gap-6 px-4 place-items-center justify-center align-middle">
      <div className="w-[270px] md:w-[350px] md:text-5xl text-center text-zinc-800 text-3xl font-extrabold">
        Explore endless possibilities.
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-3 md:p-16">
        <div className="feature__card bg-[#C3B2E7] sticky top-[60px] md:relative md:top-0 p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-purple-950">
              Fast transaction time
            </h4>
            <p className="text-sm text-black/50 font-medium">
              Enjoy a fast transaction time. when you use our in app chat
              feature.
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
        <div className="feature__card bg-[#F682A5] sticky top-[70px] md:relative md:top-0 p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-pink-950">Flexible</h4>
            <p className="text-sm text-black/70 font-medium">
              We try to be as flexible as possible so you can feel free to
              negotiate rates that works best for you
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
        <div className="feature__card bg-[#B8CEDC] sticky top-[80px] md:relative md:top-0 p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-blue-950">Secure</h4>
            <p className="text-sm text-black/70 font-medium">
              Trade with ease and a relaxed spirit with out secure web app built
              with your privacy as a top priority.
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
        <div className="feature__card bg-[#F9A474] sticky top-[90px] md:relative md:top-0 p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-orange-950">Versatility</h4>
            <p className="text-sm text-black/70 font-medium">
              If a gift card exists then we will buy it, no worries.
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
        <div className="feature__card bg-[#FEDF6F] sticky top-[100px] md:relative md:top-0 p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-orange-950">Inbox</h4>
            <p className="text-sm text-black/70 font-medium">
              Track gift cards and crypto currencies transactions, conversation
              histories, and more
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
        <div className="feature__card bg-[#C9DA8F] sticky top-[110px] p-6 rounded-2xl text-left grid place-items-center">
          <div className="grid gap-2">
            <h4 className="text-xl font-bold text-orange-950">
              We even do refunds
            </h4>
            <p className="text-sm text-black/70 font-medium">
              We strive to make sure you have a great trading experience, so we
              are willing to give you a refund when things go south.
            </p>
          </div>
          <div>
            <div className="flex align-middle place-items-center p-8">
              <div>
                <Image
                  src={"/placeholder1.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[-15deg] rounded-md shadow-sm"
                />
              </div>
              <div>
                <Image
                  src={"/placeholder2.png"}
                  alt={"placeholder1"}
                  width={133}
                  height={186}
                  className="rotate-[4deg] mr-2 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl w-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
