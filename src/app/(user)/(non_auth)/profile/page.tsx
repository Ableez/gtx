import Image from "next/image";
import React from "react";

type Props = {};

const UserProfile = (props: Props) => {
  return (
    <div className="container border">
      <div className="grid place-items-center justify-center align-middle gap-3 w-full">
        {/* Profile name and image */}
        <div>
          <Image
            alt={`Username`}
            width={100}
            height={100}
            src={"/logoplace.svg"}
          />
        </div>
        <h4
          contentEditable
          className="text-xl font-semibold px-2 rounded-xl outline-none"
        >
          Praise
        </h4>{" "}
        <p className="text-sm px-2 rounded-xl outline-none select-none ">praise@mail.com</p>
      </div>
    </div>
  );
};

export default UserProfile;
