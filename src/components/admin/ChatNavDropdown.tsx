"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/utils/firebase";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { addDoc, collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {};

const ChatNavDropdown = (props: Props) => {
  const [openTrans, setOpenTrans] = useState(false);
  const router = useRouter();

  const startTransaction = async () => {
    try {
      const transactionsRef = collection(db, "Transactions");

      // Update the transactions array and lastMessage fields

      // #TODO; find a way to get user information and add it to the transaction doc
      await addDoc(transactionsRef, {
        card: [
          {
            vendor: "",
            subcategory: "",
            price: {
              dollars: 100,
              naira: 500,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="fixed top-0 flex align-middle justify-between place-items-center py-3 w-full z-[999] px-2">
      <Button
        onClick={() => router.back()}
        variant={"ghost"}
        className="hover:bg-white border p-3 bg-neutral-100 dark:hover:bg-white dark:bg-neutral-800 text-neutral-600 dark:text-white"
      >
        <ArrowLeftIcon width={24} />
      </Button>
      <h4 className="font-bold">Admin</h4>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="hover:bg-white border p-3 bg-neutral-100 dark:hover:bg-white dark:bg-neutral-800 text-neutral-600 dark:text-white"
          >
            <EllipsisVerticalIcon width={25} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-2 z-[9999] grid">
          <DropdownMenuLabel className="text-neutral-500 uppercase tracking-wider text-[0.7em]">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
           

            <DropdownMenuItem className="py-3">Terminate Chat</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3">View User</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default ChatNavDropdown;
