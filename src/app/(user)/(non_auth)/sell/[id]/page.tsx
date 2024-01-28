import CardSelector from "@/components/giftcard/CardSelector";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

type Params = {
  price: number;
  subcategory: string;
};

const GiftCardPage = ({ params }: Props) => {
  const user = cookies().get("user");
  return (
    <>
      <div className="container font-bold text-lg relative max-w-screen-sm pb-6">
        <Link
          href={"/sell"}
          className="border-2 absolute -top-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 p-3"
        >
          <ArrowLeftIcon width={20} />
        </Link>
        <Drawer open={!user} dismissible={true}>
          <DrawerContent className="border-none ring-0 max-w-xl mx-auto">
            <DrawerHeader>
              <DrawerTitle className="pb-2 ">Not Logged in!</DrawerTitle>
              <DrawerDescription>
                You can only sell a gift card when you are logged in
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="gap-2">
              <Link
                href={"/login"}
                className="bg-primary p-3 text-white font-semibold rounded-xl w-fit mx-auto px-6"
              >
                Okay Login
              </Link>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <CardSelector id={params.id} />

        <div className="mt-10 text-center font-light text-[0.6em]">
          Please read our{" "}
          <Link href={"/"} className=" text-secondary">
            terms and conditions
          </Link>
        </div>
      </div>
    </>
  );
};

export default GiftCardPage;
