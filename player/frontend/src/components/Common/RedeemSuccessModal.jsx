"use client";

import React from "react";
import Cross from "@/assets/images/Cross";
import { PrimaryButton } from "@/components/Common/Button";
import useModalsStore from "@/store/useModalsStore";
import Image from "next/image";

const RedeemSuccessModal = () => {
  const { clearModals } = useModalsStore();

  return (
    <div className="max-w-2xl w-full">
      <div className="  rounded-lg p-2">
        <div className="  rounded-lg p-6 max-md:p-4 flex items-center justify-center relative">
          <div className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200">
            <button onClick={() => clearModals()}>
              <Cross />
            </button>
          </div>
          <div className="text-center">
            {/* <Image
              src={SuccessIcon}
              alt="Success"
              className="w-16 mx-auto mb-4"
            /> */}
            <h1 className="text-2xl max-md:text-xl font-bold text-white pb-3">
              Redeem Request Submitted!
            </h1>
            <p className="text-sm max-md:text-xs text-white pb-3">
              Your wallet will be credited shortly.
            </p>
            <PrimaryButton onClick={clearModals} className="mt-5 w-full">
              OK
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemSuccessModal;
