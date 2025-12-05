import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "../Common/Button";
import { toast } from 'react-toastify';
import logo from "../../assets/images/logo/logo.svg";
import modalImg from "../../../public/assets/img/png/verify-email.png";
import { claimDailyBonusAction, getProfile } from "@/actions";
import Cross from "@/assets/images/Cross";
import Scoin from "../../../public/assets/img/svg/Scoin";
import Gcoin from "../../../public/assets/img/svg/Gcoin";
import ArrowCircleLeft from "../../../public/assets/img/svg/ArrowCircleLeft";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
import GC from "@/assets/images/coins/GC";
import SC from "@/assets/images/coins/SC";
import { useIP } from "@/utils/ipUtils";

const DailyBonus = ({
  bonusName,
  gcAmount,
  scAmount,
  description,
  btnText,
  termCondition,
  imageUrl,
  // closeModal,
}) => {
  const { closeModal } = useModalsStore();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user, userIp,setUserIp } = useUserStore();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [skipDailyBonusLoading, setSkipDailyBonusLoading] = useState(false)
  useIP(setUserIp);
  const getUserProfile = async () => {
    const res = await getProfile();
    setUser(res);
  };


  const claimBonus = async () => {
    try {
      setIsLoading(true);
      const result = await claimDailyBonusAction({
        cancel: false,
        userIp
      });

      if (result?.success) {
        toast.success("Bonus successfully claimed!");
        getUserProfile();
        closeModal();
      } else {
        toast.error(result?.message || "Failed to claim bonus.");
        closeModal();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipChange = async () => {
    try {
      setSkipDailyBonusLoading(true);
      const result = await claimDailyBonusAction({
        needDailyBonus : "false",
        cancel: false,
        userIp
      });

      if (result?.success) {
        toast.success("Bonus skipped for the day.");
        getUserProfile();
        closeModal();
      } else {
        toast.error(result?.message || "Failed to skip bonus.");
        closeModal();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSkipDailyBonusLoading(false);
    }
  };

  return (
    <div className="max-w-[766px] w-full">
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
            onClick={() => closeModal()}
            className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200"
          >
            <Cross />
          </button>
        </div>

        <div className="max-w-[605px] w-full mx-auto flex max-md:flex-col items-center gap-9 max-md:gap-2 justify-between p-7 max-md:p-9">
          <div className="max-w-48 max-md:max-w-40 w-full relative before:content-[''] before:absolute before:w-3/4 before:h-3/4 before:bg-white before:blur-[61px] before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-[1]">
            {imageUrl && (
              <Image
                src={imageUrl || modalImg}
                alt={bonusName || "Phibet Logo"}
                width={1000}
                height={1000}
                className="w-full relative z-[2]"
              />
            )}
          </div>

          <div className="max-w-[294px] w-full relative z-[2]">
            <h1 className="text-2xl text-white max-md:text-xl font-bold pb-3">
              {bonusName}
            </h1>
            <div className="flex items-center gap-7 mb-5">
              <div className="flex items-center gap-2.5">
                {/* <Scoin /> */}
                <SC height="30px" width="30px"/>
                <span className="text-white text-2xl font-bold">
                  {scAmount}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* <Gcoin /> */}
                <GC height="30px" width="30px"/>
                <span className="text-white text-2xl font-bold">
                  {gcAmount}
                </span>
              </div>
            </div>

            <p className="text-sm max-md:text-xs text-white mb-5">
              {description}
            </p>
            <div className="flex flex-col gap-3">
              <PrimaryButton
                onClick={claimBonus}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : btnText || "Claim Now"}
              </PrimaryButton>
              <SecondaryButton
                onClick={handleSkipChange}
                disabled={skipDailyBonusLoading}
                className="w-full"
              >
                {skipDailyBonusLoading ? "Loading..." : "Skip Bonus Today"}
              </SecondaryButton>
            </div>
            {termCondition?.EN && (
              <p className="text-xs  00 mt-4">{termCondition.EN}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyBonus;
