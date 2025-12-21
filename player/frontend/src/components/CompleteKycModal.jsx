"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import BlockedImage from "@/assets/images/blocked.png";
import logo from "@/assets/images/logo/logo.svg";
import useModalsStore from "@/store/useModalsStore";
import Cross from "@/assets/images/Cross";
import Link from "next/link";
import { PrimaryButton } from "./Common/Button";
import useUserStore from "@/store/useUserStore";

const CompletedKycModal = ({ close }) => {
  const { clearModals, closeModal } = useModalsStore();
  const router = useRouter();
  const {user} = useUserStore();

  const handleGetStarted = () => {
    // if(user?.kycStatus!=="K4"|| user?.kycStatus !=="K5"){
    router.push("/user/kyc");
    closeModal(<CompletedKycModal />);
  // }
  //   else{
  //     router.push("/user/profile");
  //     closeModal(<CompletedKycModal />);
  //   }
  };

  return (
    <div className="inset-0   flex items-center justify-center relative">
      {close && (
        <button
          onClick={() => clearModals()}
          className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
        >
          <Cross />
        </button>
      )}
      <div className="max-w-[360px] md:max-w-[1250px] relative flex flex-col md:flex-row gap-x-12 items-center z-10 p-4 md:p-10 rounded-lg shadow-lg max-sm:gap-3 max-lg:gap-6">
        <div>
          <Image
            src={BlockedImage}
            alt="Access Restricted"
            width={900}
            height={900}
            className="max-w-[80%] mx-auto xl:max-w-[633px]"
          />
        </div>

        <div className="text-center md:text-center text-white flex-col justify-center items-center max-w-[410px] p-2.5">
          <p className="text-base sm:text-xl font-bold mb-7">
            In order to access and play with USD, you must first complete KYC.
          </p>
          <PrimaryButton className="my-4" onClick={handleGetStarted}>Get Started</PrimaryButton>

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

export default CompletedKycModal;
