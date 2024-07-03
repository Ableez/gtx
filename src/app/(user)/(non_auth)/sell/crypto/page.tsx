import React from "react";
import { crypto } from "../../../../../../public/data/crypto";
import Link from "next/link";
import CardDisplay from "@/components/sellPage/CardDisplay";
import { useSellTab } from "@/lib/utils/store/sellTabs";

type Props = {};

const Crypto = (props: Props) => {
  return (
    <div className="max-w-screen-md mx-auto">
      <CardDisplay filteredCards={crypto} />
    </div>
  );
};

export default Crypto;
