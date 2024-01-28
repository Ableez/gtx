import React from "react";

type Props = {};

const Metrics = (props: Props) => {
  return (
    <div className="metrics py-10 md:px-16 px-4 md:flex-row flex-col flex align-middle place-items-center justify-center md:gap-[7em] gap-[2em]">
      <div>
        <h4 className="md:text-2xl text-xl" style={{ fontWeight: "400" }}>
          Fast and reliable payouts
        </h4>
      </div>
      <div className="flex md:flex-row flex-col align-middle justify-between place-items-center gap-16">
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">5min</h4>
          <p className="text-sm md:text-base text-black text-opacity-60 para dark:text-neutral-400">
            Delay
          </p>
        </div>
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">0</h4>
          <p className="text-sm md:text-base text-black text-opacity-60 para dark:text-neutral-400">
            Scams Reported
          </p>
        </div>
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">0</h4>
          <p className="text-sm md:text-base text-black text-opacity-60 para dark:text-neutral-400">
            Ripping
          </p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
