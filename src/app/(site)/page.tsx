import LandingNavbar from "@/components/landing/LandingNavbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen p-24 flex flex-row place-items-center gap-2">
        <h4 className="text-5xl font-bold">Landing Page</h4>
        <Link className="text-3xl font-semibold" href={"/sell"}>
          <Button variant={"secondary"}>Sell</Button>
        </Link>
      </main>
    </>
  );
}
