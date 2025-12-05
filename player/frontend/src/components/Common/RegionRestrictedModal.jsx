"use client";
import React from "react";
import Image from "next/image";
import BlockedImage from "@/assets/images/blocked.png";
import logo from "@/assets/images/logo/logo.svg";
import EmailVerification from "../Auth/EmailVerification";
import ForgotPassword from "../Auth/ForgotPassword";
import OtpVerification from "../Auth/OtpVerification";
import useModalsStore from "@/store/useModalsStore";

const RegionRestrictedModal = () => {
  const { openModal } = useModalsStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0E25]">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="max-w-[1250px] relative flex flex-col md:flex-row gap-x-12 items-center z-10 bg-[#0D0E25] p-10 rounded-lg shadow-lg max-lg:gap-6">
        <div>
          <Image
            src={BlockedImage}
            alt="Access Restricted"
            width={900}
            height={900}
            className="sm:max-md:max-w-[80%] mx-auto xl:max-w-[633px]"
          />
        </div>

        <div className="text-center md:text-center text-white flex-col justify-center items-center max-w-[410px] p-2.5">
          <h2 className="text-xl sm:text-3xl font-bold mb-7">
            Thank you for your interest
          </h2>
          <p className="text-base sm:text-xl font-bold mb-7">
            Unfortunately, Phibet is not available in this region. If you
            believe you should have access, please contact us.
          </p>
          <p className="text-md text-[#FFB74D] font-semibold mb-2">
            Kind Regards
          </p>

          <Image
            src={logo}
            alt="Phibet Logo"
            width={235}
            height={40}
            className="h-auto sm:flex text-center mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default RegionRestrictedModal;
