import Image from "next/image";
import React from "react";
import logo from "../../assets/images/logo/logo.svg";

const Blocked = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center   text-white">
      <div className="text-center">
        <Image
          src={logo}
          className="h-full max-w-[380px] w-full m-auto"
          alt="Not-Found"
        />
        <div className="mt-8 px-4 text-2xl font-semibold text-left sm:text-center">
          Unfortunately, your region is blocked from playing on Phibet.
        </div>
        <div className="text-left my-2 px-4 sm:text-center">
          If you have any questions, please contact us at{" "}
          <a
            href="mailto:support@phibet.com"
            className="underline font-semibold hover:cursor-pointer"
          >
            support@phibet.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Blocked;
