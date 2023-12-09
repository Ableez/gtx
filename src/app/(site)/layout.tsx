import LandingNavbar from "@/components/landing/LandingNavbar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const LandingLayout = (props: Props) => {
  return (
    <div>
      {/* <LandingNavbar /> */}
      {props.children}
    </div>
  );
};

export default LandingLayout;
