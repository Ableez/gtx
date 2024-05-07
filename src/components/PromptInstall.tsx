import { Button } from "./ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const PromptInstall = () => {
  return (
    <div
      id="installContainer"
      className="hidden place-items-center bg-purple-300 font-medium text-[14px] dark:from-purple-500/5 dark:to-pink-600/20 bg-gradient-to-tr dark:bg-black "
    >
      <div className="p-2 flex align-middle place-items-center justify-between sticky top-0 max-w-md w-full mx-auto">
        <h4>Install Greatex to your device</h4>
        <Button id={"installButton"} className="flex gap-1">
          <ArrowDownTrayIcon width={16} /> Install
        </Button>
      </div>
    </div>
  );
};

export default PromptInstall;
