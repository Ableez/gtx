import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Loader from "@/components/Loader";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type Props = {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
};

const TransactionNavbar = ({ setTab, tab }: Props) => {
  const router = useRouter();

  return (
    <nav className="bg-white dark:bg-neutral-800 max-w-md mx-auto px-4 py-3 flex align-middle justify-between place-items-center">
      <div className="flex align-middle justify-between place-items-center">
        <Button
          variant={"ghost"}
          className="border px-2"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon width={22} />
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex align-middle place-items-center font-light capitalize px-3 rounded-lg py-2 focus-visible:outline-none text-neutral-500 border hover:shadow dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800">
          <span className="font-semibold">
            <FunnelIcon width={16} />
          </span>{" "}
          <span className="ml-1">{tab}</span> <ChevronDownIcon width={22} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setTab("all");
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setTab("crypto");
            }}
          >
            Crypto
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setTab("giftcard");
            }}
          >
            Gift card
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default TransactionNavbar;
