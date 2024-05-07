import { giftcards } from "@/lib/data/giftcards";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  tabTitle: string;
  setTabTitle: Function;
};

const SearchBar = ({ setTabTitle, tabTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
            src={card.image}
            width={22}
            height={22}
            alt={card.name}
          />
          <span> {card.name} </span>
        </CommandItem>
      </Link>
    );
  });

  return (
    <div className="sticky px-4 top-0 z-[50] bg-white dark:bg-black py-4 shadow-sm dark:rounded-2xl">
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
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 justify-self-end">
          <span className="text-xs">CTRL⌘</span>K
        </kbd>
      </Button>
      <div className="mt-3 gap-2 flex">
        {TABS.map((tab, idx) => {
          return (
            <Button
              className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
                tabTitle === tab.link
                  ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                  : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
              }`}
              onClick={() => setTabTitle(tab.link)}
              key={idx}
            >
              {tab.title}
            </Button>
          );
        })}
      </div>
      <div className="px-2">
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandSeparator />
            <CommandGroup heading="Gift cards">{renderCards}</CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </div>
  );
};

export default SearchBar;
