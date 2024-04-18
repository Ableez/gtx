import {
  CurrencyDollarIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import UserInfoForm from "./_components/UserInfoForm";
import SignOutButton from "./_components/SignOutButton";
import Link from "next/link";
import VerificationButton from "./_components/VerificationButton";

type Props = {};

const UserProfile = (props: Props) => {
  return (
    <div className="px-4 grid gap-6 grid-flow-row pb-8 py-4 max-w-screen-sm mx-auto">
      <UserInfoForm />
      <div>
        <Link href={"/chat"}>
          <button className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5">
            <ChatBubbleIcon width={18} /> <span>View conversations</span>
          </button>
        </Link>
        <Link href={"/transactions"}>
          <button className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5">
            <CurrencyDollarIcon width={18} /> <span>Transactions</span>
          </button>
        </Link>
        <Link href={"/iforgot"}>
          <button className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5">
            <EyeSlashIcon width={18} /> <span>Reset password</span>
          </button>
        </Link>
      </div>
      <div>
        <VerificationButton />
        <Link href={"/support"}>
          <button className="flex align-middle w-full place-items-center justify-start gap-2 duration-300 hover:bg-opacity-60 border-b border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-700 px-3 py-3.5 text-amber-500">
            <InformationCircleIcon strokeWidth={2} width={18} />{" "}
            <span>Report an issue</span>
          </button>
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
};

export default UserProfile;
