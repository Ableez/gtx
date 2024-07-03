import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {};

const ReadyNow = (props: Props) => {
  return (
    <div className="h-screen grid place-items-center text-xl">
      Are you ready to trade?
    </div>
  );
};

export default ReadyNow;
