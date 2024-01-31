import Image from "next/image";
import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type Props = {};
const Cwu = (props: Props) => {
  return (
    <div>
      <h4 className="md:text-4xl text-3xl font-extrabold py-8 mt-8 px-8 md:px-4 my-12">
        Chat with us live
      </h4>

      <div className="bg-pink-200 w-fit rounded-t-2xl mx-auto overflow-clip">
        <div className="mx-auto">
          <Image
            alt="phone mockup"
            width={2000}
            height={2000}
            src={"/Image.png"}
            className="w-[90vw]"
          />
        </div>
      </div>
      <div>
        <Link
          className="cursor-pointer mt-12 py-3 px-4 rounded-full font-medium text-lg flex align-middle justify-center gap-3 hover:gap-5 duration-300 bg-primary w-2/3 md:w-1/3 mx-auto ring-4 ring-transparent  hover:ring-pink-300 text-white"
          href={"/sell"}
        >
          Get Started <ArrowRightIcon width={20} />
        </Link>
      </div>
    </div>
  );
};

export default Cwu;
