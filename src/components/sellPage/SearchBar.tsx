"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSellTab } from "@/lib/utils/store/sellTabs";
import { api } from "@/trpc/react";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { tab, updateTab } = useSellTab((state) => state);

  // Fetch giftcards with React Query caching
  const { data: giftcards = [] } = api.giftcard.getAllCards.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const TABS: { title: string; link: string }[] = [
    {
      title: "Most Popular",
      link: "mostpopular",
    },
    {
      title: "All",
      link: "all",
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const renderCards = giftcards.map((card, idx) => {
    return (
      <Link key={idx} href={`/sell/${card.id}`}>
        <CommandItem className="flex gap-3">
          <Image
            priority
            src={card.coverImage || ""}
            width={22}
            height={22}
            alt={card.name}
          />
          <span> {card.name} </span>
        </CommandItem>
      </Link>
    );
  });

  // hide search bar if displaying a cryptocurrency details
  if (
    pathname.split("/").length > 3 &&
    pathname.split("/").includes("crypto")
  ) {
    return null;
  }

  return (
    <div className="sticky px-3 top-0 z-50 bg-white/70 backdrop-blur-xl dark:bg-black py-2.5 pt-3 shadow-sm dark:rounded-2xl max-w-screen-md mx-auto rounded-2xl dark:bg-neutral-800/70">
      <Button
        className="w-full border flex align-middle place-items-center justify-between text-neutral-500 py-6"
        aria-label="Search"
        variant={"ghost"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex align-middle place-items-center justify-between gap-2">
          <div>
            <MagnifyingGlassIcon width={18} />
          </div>
          <span>Search...</span>
        </div>
      </Button>
      <div className="mt-1.5 gap-2 flex w-full overflow-x-scroll py-1 px-0">
        {TABS.map((t, idx) => {
          return (
            <Link href={"/sell"} key={idx} onClick={() => updateTab(t.link)}>
              <Button
                className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
                  tab === t.link
                    ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                    : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
                }`}
              >
                {t.title}
              </Button>
            </Link>
          );
        })}
        <Link href={"/sell/crypto"}>
          <Button
            className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
              pathname === "/sell/crypto"
                ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
            }`}
            onClick={() => updateTab(pathname)}
          >
            Cryptocurrencies
          </Button>
        </Link>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <Button
          className="w-12 h-12 bg-neutral-100 z-50 dark:bg-black  rounded-full absolute top-0 right-0"
          onClick={() => setOpen(false)}
          variant={"ghost"}
          size={"icon"}
        >
          <XMarkIcon width={18} />
        </Button>
        <CommandList className="max-h-full">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="Gift cards">{renderCards}</CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchBar;
