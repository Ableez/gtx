import SearchBar from "@/components/sellPage/SearchBar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const SellLayout = ({ children }: Props) => {
  return (
    <div>
      <SearchBar />

      {children}
    </div>
  );
};

export default SellLayout;
