import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex place-items-center justify-center">
      <SignUp afterSignOutUrl={"/sell"} fallbackRedirectUrl={"/sell"} />
    </div>
  );
}
