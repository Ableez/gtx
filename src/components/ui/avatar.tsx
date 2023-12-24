"use client";

import React, { useCallback, useEffect, useState } from "react";

type Props = {};

const colors = [
  "#FF3B30",
  "#FF453A",
  "#FF9500",
  "#FF9F0A",
  "#FFCC00",
  "#FFD60A",
  "#34C759",
  "#30D158",
  "#00C7BE",
  "#63E6E2",
  "#30B0C7",
  "#40CBE0",
  "#32ADE6",
  "#64D2FF",
  "#007AFF",
  "#0A84FF",
  "#5856D6",
  "#5E5CE6",
  "#AF52DE",
  "#BF5AF2",
  "#FF2D55",
  "#FF375F",
  "#A2845E",
  "#AC8E68",
];

const Avatar = (props: Props) => {
  const [curr, setCurr] = useState<number>(0);

  const rand = useCallback(() => {
    const numbe = Math.floor(Math.random() * colors.length);
    setCurr(numbe);
  }, []);

  useEffect(() => {
    rand();
  }, [rand]);

  console.log(colors[curr]);

  return (
    <span
      style={{
        backgroundImage: `linear-gradient(to left, ${colors[curr]}, ${
          colors[curr - 1]
        })`,
      }}
      className={`w-fit p-6 bg-gradient-to-tr rounded-full shadow-primary`}
    ></span>
  );
};

export default Avatar;
