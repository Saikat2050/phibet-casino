/* 'use client'
import React from 'react'
import Lottie from "lottie-react";
import GiftAnimation from "@/assets/ui-kit/icons/jason/Gift.json";

function TimerAnimation() {
  return (
    <>
      <Lottie animationData={GiftAnimation} loop={true} />
    </>
  )
}

export default TimerAnimation
 */

"use client";

import React from "react";
// import Lottie from "lottie-react";

import GiftAnimation from "@/assets/gif/gift-animation.gif";

import WelcomePurchaseModal from "../WelcomePurchaseModal";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { getCookie } from "@/utils/clientCookieUtils";
import Image from "next/image";
import CompleteYourProfileModal from "../CompleteYourProfileModal";
import { usePathname } from "next/navigation";

function TimerAnimation({ welcomeBonusPurchase }) {
  // Call the custom hook when clicked
  const { openModal, closeModal, setIsCloseNeed, clearModals } =
    useModalsStore();
  const userToken = getCookie("accessToken");
  const { user } = useUserStore();
  // const hasIncompleteProfile = user?.kycStatus === "K1" || user?.kycStatus === "K2" || !user?.phoneVerified;
  const hasIncompleteProfile = user?.profileCompleted == false || user?.phoneVerified == false;

  // const hasIncompleteKyc = user?.kycStatus === "K2" || user?.kycStatus === "K3";

  const handleClick = () => {
    if (hasIncompleteProfile) {
      openModal(<CompleteYourProfileModal close={true} />);
      return;
    }
    if (
      userToken &&
      user.isEmailVerified &&
      welcomeBonusPurchase?.welcomePurchaseBonusApplicable
    ) {
      openModal(
        <WelcomePurchaseModal />, // The modal you want to show
        "purchaseBonus"
      );
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Image
        src={GiftAnimation}
        alt={"gift"}
        width={2000}
        className="w-72 max-sm:w-40"
      />
    </div>
  );
}

export default TimerAnimation;
