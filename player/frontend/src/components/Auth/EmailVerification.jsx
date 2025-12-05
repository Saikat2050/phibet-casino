"use client";

import useModalsStore from "@/store/useModalsStore";
import React from "react";
import Cross from "@/assets/images/Cross";
import logo from "../../assets/images/logo/logo.svg";
import Image from "next/image";
import modalImg from "../../../public/assets/img/png/verify-email.png";
import { PrimaryButton } from "../Common/Button";
import ArrowCircleLeft from "../../../public/assets/img/svg/ArrowCircleLeft";

const EmailVerification = () => {
  const { clearModals } = useModalsStore();
  return (
    <div className="max-w-2xl w-full">
      <div className="  rounded-lg p-2">
        <div className="  rounded-lg p-6 max-md:p-4  flex items-center justify-center z-[2] relative">
          <Image
            src={logo}
            alt="Phibet Logo"
            width={1000}
            height={1000}
            className="max-w-64 max-md:max-w-40"
          />

          <button
            onClick={() => clearModals()}
            className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200"
          >
            <Cross />
          </button>
        </div>

        <div className="max-w-xl w-full mx-auto flex max-md:flex-col items-center gap-9 max-md:gap-2 justify-between p-7 max-md:p-4">
          <div className="max-w-48 max-md:max-w-40 w-full relative before:content-[''] before:absolute before:w-3/4 before:h-3/4 before:bg-white before:blur-[61px] before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-[1]">
            <Image
              src={modalImg}
              alt="Phibet Logo"
              width={1000}
              height={1000}
              className="w-full relative z-[2]"
            />
          </div>

          <div className="relative z-[2]">
            <h1 className="text-2xl max-md:text-xl font-bold text-white pb-3">
              Validate Your Account
            </h1>
            <p className="text-sm max-md:text-xs text-white pb-3">
              We've sent a verification code to your email, please enter it to
              continue.
            </p>

            <PrimaryButton className="mt-5 w-full">Go to home</PrimaryButton>

            <a
              href="#"
              className="text-xs text-white font-bold flex items-center justify-center gap-1 mt-7 leading-none"
            >
              {" "}
              <ArrowCircleLeft /> Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
