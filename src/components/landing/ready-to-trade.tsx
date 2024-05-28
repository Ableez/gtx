import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

type Props = {};

const ReadyNow = (props: Props) => {
  return (
    <div className="p-4 md:px-24 grid-cols-3 flex flex-col gap-10 md:flex-row align-middle place-items-center my-32">
      <div className="md:hidden block">
        <h4 className="text-2xl font-bold">
          So are you ready to start trading?
        </h4>
      </div>
      <div className="rounded-[2rem] md:w-[60%] overflow-clip aspect-square md:aspect-auto">
        <Image
          src={"/ready_to_buy.png"}
          alt=""
          width={400}
          height={400}
          className="w-full h-[400px] object-cover"
        />
      </div>
      <div className="grid gap-6 md:w-[40%] w-full">
        <h4 className="text-2xl md:text-[3rem] text-left font-bold leading-tight hidden md:block">
          So are you ready to start trading?
        </h4>
        <Button className="w-full flex align-middle place-items-center gap-2 py-4">
          Jump in <ArrowRightIcon width={14} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default ReadyNow;
