"use client";

import React from "react";
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";
import { useRouter } from "next/navigation";

const GeneralInfoModal = () => {
  const { clearModals } = useModalsStore();
  return (
    <>
      <div className="max-w-xl w-full">
        <div className="  rounded-lg p-2">
        <div className="  rounded-lg p-6 max-md:p-4  flex items-center justify-center z-[2] relative">
            <p className="text-white text-normal p-[10px]" > In order to request a redemption, KYC must be completed. Please click the KYC button in the menu and complete this process to access redemptions.</p>
            <button
              onClick={clearModals}
              className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200"
            >
              <Cross />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralInfoModal;
