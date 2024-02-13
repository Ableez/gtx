import Loader from "@/components/Loader";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="h-screen w-screen bg-white dark:bg-[#00000089] bg-opacity-10 backdrop-blur-sm absolute top-0 left-0 z-[99999] grid place-items-center align-middle">
      <Loader />
    </div>
  );
};

export default Loading;
