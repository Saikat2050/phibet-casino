"use client";
import React from "react";
import TimerAnimation from "../Header/TimerAnimation";
import DailyBonusTimer from "../WelcomePurchaseModal/DailyBonusTimer";
import { getWelcomePurchaseBonus } from "@/actions";
import useUserStore from "@/store/useUserStore";
import { useState } from "react";
import { useEffect } from "react";
import { deleteAllClientCookies, getCookie } from "@/utils/clientCookieUtils";
import { usePathname } from "next/navigation";
const FloatingComponent = () => {
  const { user, welcomeBonusPurchase, setWelcomeBonusPurchase } =
    useUserStore();
  const userToken = getCookie("accessToken");
  const pathname = usePathname();
  // const [welcomeBonusPurchase, setWelcomeBonusPurchase] = useState(null);


  async function callGetWelcomePurchaseBonus() {
    const bonus = await getWelcomePurchaseBonus();
    setWelcomeBonusPurchase(bonus);
  }
  useEffect(() => {
    if (user?.welcomePurchaseBonusApplicable) {
      callGetWelcomePurchaseBonus();
    }
  }, [user?.welcomePurchaseBonusApplicable]);

  if (
    user?.isEmailVerified &&
    user?.welcomePurchaseBonus &&
    user?.welcomePurchaseBonusApplicable &&
    userToken
    // (welcomeBonusPurchase?.welcomePurchaseBonusApplicable && userToken)
  ) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center">
        {pathname !== "/blocked" && (
          <>
            <div className="bg-yellow-500 rounded-full text-black font-bold text-center text-xl py-1.5 px-4 md:text-sm md:px-2.5">
              <DailyBonusTimer
                eventDateTime={
                  user?.welcomePurchaseBonus?.welcomePurchaseBonusEndTime
                }
              />
            </div>
            <div className="mt-2 h-72 w-72 rounded-full mx-auto md:h-32 md:w-32 max-sm:h-44 max-sm:w-40 ">
              <TimerAnimation welcomeBonusPurchase={welcomeBonusPurchase} />
            </div>
          </>
        )}
      </div>
    );
  }
  return <></>;
};

export default FloatingComponent;
