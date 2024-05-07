import Footer from "@/components/landing/Footer";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Navbar from "@/components/landing/Navbar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const LandingLayout = (props: Props) => {
  return (
    <>
      <LandingNavbar />
      {props.children}
      {/* <Footer /> */}
    </>
  );
};

export default LandingLayout;
