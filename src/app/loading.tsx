import Loader from "@/components/Loader";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="grid place-items-center justify-center align-middle h-[80vh]">
      <Loader />
    </div>
  );
};

export default Loading;
