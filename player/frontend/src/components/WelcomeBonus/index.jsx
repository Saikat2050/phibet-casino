import {
  claimWelcomeBonusAction,
  getProfile
} from "@/actions";
import GC from "@/assets/images/coins/GC";
import SC from "@/assets/images/coins/SC";
import Cross from "@/assets/images/Cross";
import useUserStore from "@/store/useUserStore";
import { useIP } from "@/utils/ipUtils";
import Image from "next/image";
import { useState } from "react";
import { toast } from 'react-toastify';
import modalImg from "../../../public/assets/img/png/verify-email.png";
import logo from "../../assets/images/logo/logo.svg";
import { PrimaryButton, SecondaryButton } from "../Common/Button";
const WelcomeBonus = ({
  bonusName,
  gcAmount,
  scAmount,
  description,
  btnText,
  termCondition,
  imageUrl,
  closeModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user, userIp,setUserIp } = useUserStore();
  const [isRejectBonusLoading ,setRejectBonusLoading] = useState(false)

  useIP(setUserIp);

  const getUserProfile = async () => {
    const res = await getProfile();
    setUser(res);
  };

  const claimBonus = async () => {
    try {
      setIsLoading(true);
      const result = await claimWelcomeBonusAction({
        userIp,
      });

      if (result?.success) {
        toast.success("Bonus successfully claimed!");
        getUserProfile();
        closeModal();
      } else {
        toast.error(result?.message || "Failed to claim bonus.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBonus = async () => {
    try {
      setRejectBonusLoading(true);
      const result = await claimWelcomeBonusAction({
        needWelcomeBonus: "false",
        userIp,
      });

      if (result?.success) {
        toast.success("Welcome bonus declined.");
        getUserProfile();
        closeModal();
      } else {
        toast.error(result?.message || "Failed to claim bonus.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setRejectBonusLoading(false);
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
              {/* <PrimaryButton className="mt-5 w-full">Go to home</PrimaryButton> */}

              <SecondaryButton
                onClick={rejectBonus}
                disabled={isRejectBonusLoading}
                className="w-full"
              >
                {isRejectBonusLoading ? "Loading..." : "Skip Welcome Bonus"}
              </SecondaryButton>
            </div>
            {/* Terms and Conditions */}
            {termCondition?.EN && (
              <p className="text-xs  00 mt-4">{termCondition.EN}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBonus;
