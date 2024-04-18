"use client";

import CardSelector from "@/components/giftcard/CardSelector";
import { postToast } from "@/components/postToast";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeUrlString } from "@/lib/utils";
import Cookies from "js-cookie";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    id: string;
  };
};

const GiftCardPage = ({ params }: Props) => {
  const [mount, setMount] = useState(false);

  const router = useRouter();
  const card_id = decodeUrlString(params.id);

  useEffect(() => {
    if (!mount) {
      setMount(true);
    }

    const user = Cookies.get("user");

    if (!user && mount) {
      postToast("Not signed in!", {
        description: "You can only sell a gift card when you are logged in",
        action: {
          label: "Login",
          onClick: () => {
            router.push("/login");
          },
        },
        duration: 8000,
      });
    }
  }, [mount, router]);

  return (
    <>
      <div className="container font-bold text-lg relative max-w-screen-sm pb-6">
        {/* {loading && <Loading />} */}

        <Button
          variant={"outline"}
          size={"icon"}
          className="hover:ring-4 absolute -top-2"
        >
          <Link href={"/sell"}>
            <ArrowLeftIcon width={20} />
          </Link>
        </Button>

        <CardSelector id={card_id} />

        <div className="mt-10 text-center font-light text-[0.6em]">
          Please read our{" "}
          <Link
            href={"/terms"}
            className=" text-secondary font-semibold underline"
          >
            terms and conditions
          </Link>
        </div>
      </div>
    </>
  );
};

export default GiftCardPage;
