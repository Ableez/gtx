import React from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  val: string;
  change: Function;
};

const SearchBar = (props: Props) => {
  return (
    <div className="p-2 bg-white dark:bg-[#2c2c2c] rounded-xl flex align-middle place-items-center justify-between shadow-none">
      <Input
        className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-base font-semibold"
        type="text"
        value={props.val}
        onChange={(e) => props.change(e.target.value)}
        placeholder="Search..."
      />

      {!props.val ? (
        <Button variant={"ghost"} className="hover:bg-white">
          <MagnifyingGlassIcon
            color="#222"
            width={24}
            className="text-[#2c2c2c] dark:text-white"
          />
        </Button>
      ) : (
        <Button variant={"ghost"} onClick={() => props.change("")}>
          <XMarkIcon width={24} />{" "}
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
