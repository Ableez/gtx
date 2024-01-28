import React from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  val: string;
  change: Function;
  tabs: { title: string; link: string }[];
  tabTitle: string;
  setTabTitle: Function;
};

const SearchBar = (props: Props) => {
  return (
    <div className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 z-50">
      <div className="p-2 bg-white dark:bg-[#2c2c2c] rounded-xl flex align-middle place-items-center justify-between shadow border">
        <Input
          className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-base font-semibold"
          type="text"
          value={props.val}
          onChange={(e) => props.change(e.target.value)}
          placeholder="Search..."
        />

        {!props.val ? (
          <Button disabled={!props.val} variant={"ghost"} className="">
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

      <div className="mt-2 gap-2 flex">
        {props.tabs.map((tab, idx) => {
          return (
            <Button
              className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
                props.tabTitle === tab.link
                  ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                  : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
              }`}
              onClick={() => props.setTabTitle(tab.link)}
              key={idx}
            >
              {tab.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
