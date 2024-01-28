import Loader from "@/components/Loader";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="h-screen w-screen bg-white dark:bg-black  bg-opacity-30 backdrop-blur-sm fixed top-0 left-0 z-[99999] grid place-items-center align-middle">
      <Loader color="#222222" />
    </div>
  );
};

export default Loading;
