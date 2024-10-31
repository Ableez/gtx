/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import Image from "next/image";
import BackButton from "./BackButton";
import ProfileButton from "./profile-button";
import { SignedIn, UserButton } from "@clerk/nextjs";

type Props = {
  pageTitle: String;
  pathLen: string;
};

export default function SellNavbar({ pageTitle, pathLen }: Props) {
  return (
    <div className="max-w-screen-md mx-auto py-1.5 backdrop-blur-sm bg-neutral-100 dark:bg-black z-40 flex align-middle place-items-center justify-between sticky top-0 mb-4 md:px-4 px-4 mt-2">
      {pageTitle === "sell" ? (
        <Link href={"/"} className="">
          <Image
            width={34}
            height={34}
            src={"/greatexc.svg"}
            alt="Great Exchange"
          />
        </Link>
      ) : (
        <BackButton />
      )}

      <SignedIn>
        <h4 className="text-lg font-bold capitalize">{pageTitle}</h4>
      </SignedIn>

      <ProfileButton />
    </div>
  );
}
