"use client";

import useModalsStore from "@/store/useModalsStore";
import React, { useState, useRef } from "react";
import Cross from "@/assets/images/Cross";
import logo from "../../assets/images/logo/logo.svg";
import Image from "next/image";
import modalImg from "../../../public/assets/img/png/verify-email.png";
import { PrimaryButton } from "../Common/Button";
import ArrowCircleLeft from "../../../public/assets/img/svg/ArrowCircleLeft";
import { getWelcomePurchaseBonus, logoutUser, resentOtpAction, verifyEmailAction } from "@/actions";
import useUserStore from "@/store/useUserStore";
import { SecondaryButton } from "../Common/Button";
import { toast } from 'react-toastify';
import { useIP } from "@/utils/ipUtils";

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const { clearModals } = useModalsStore();
  const { setUser, setIsLoggedIn, logout ,setWelcomeBonusPurchase,setUserIp,userIp} = useUserStore();
  useIP(setUserIp);
  const handleChange = (index, event) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      // Ensure it's a digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim();

    // Only proceed if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);

      // Focus the last input field
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const trackSignUpEvent = (signUpData) => {
    try {
      // Validate if dataLayer exists
      if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer not available');
        return;
      }

      // Validate required fields
      const requiredFields = ['userId', 'affiliateId', 'clickId'];
      const missingFields = requiredFields.filter(field => !signUpData[field]);

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return;
      }

      // Push the sign-up event
      window.dataLayer.push({
        event: 'sign_up',
        user_id: signUpData.userId,
        affiliate_id: signUpData.affiliateId,
        click_id: signUpData.clickId
      });

    } catch (error) {
      console.error('Error tracking sign-up event:', error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const otpValue = otp.join("");

    // if (otpValue.length !== 6 || !/^\d{4}$/.test(otpValue)) {
    //   setError("OTP must be exactly 6 digits.");
    //   return;
    // }

    const data = {
      otpValue: otpValue,
      email: email,
    };

    const result = await verifyEmailAction(data,userIp);
    const affiliateId = result?.data?.user?.affiliateId  || 'Affiliate ID not available';
    const clickId = result?.data?.user?.affiliateCode  || 'Click ID not available';
    trackSignUpEvent({
      userId: result?.data?.user?.userId,
      affiliateId: affiliateId,
      clickId: clickId
    });
    if (!result.success) {
      toast.error(result?.apiErrors);
      setError(result?.message);
    } else {
      const bonus = await getWelcomePurchaseBonus();
      setWelcomeBonusPurchase(bonus);
      setIsLoggedIn(true);
      setUser(result?.data?.user);
      toast.success(result?.data?.message);
      toast.success(result?.message);
      clearModals();
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    const data = {
      email: email,
    };
    const result = await resentOtpAction(data);

    if (!result.success) {
      toast.error(result?.apiErrors);
      setError(result?.message);
    } else {
      toast.success(result?.message);
    }
  };

  const handleLogout = async() => {
    // await logout();
    // await logoutUser();
    await Promise.all([logout(), logoutUser()]);
    // forceLogout()
    clearModals();
  };

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

          <button onClick={handleLogout} className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200">
            <Cross />
          </button>
        </div>

        <div className="max-w-2xl w-full mx-auto flex max-md:flex-col items-center gap-9 max-md:gap-2 justify-between p-7 max-md:p-4">
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

            <form
              onSubmit={handleSubmit}
              className="mt-[68px] max-mxs:mt-10 max-w-[362px] pb-2 w-full max-md:flex max-md:flex-col max-md:items-center max-md:justify-center"
            >
              <div className="mb-[42px]">
                <div className="relative">
                  <div className="mb-5">
                    <div className="flex gap-4 items-center justify-between max-mxs:justify-center">
                      {otp.map((digit, index) => (
                        <div
                          key={index}
                          className="relative w-[58px] max-mxs:w-10"
                        >
                          <input
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className={`text-[25px] max-mxs:text-lg text-white w-full border-none bg-transparent p-2 pl-5 max-mxs:pl-4 font-normal leading-none placeholder-steelTeal-1000 focus:border-none focus-visible:outline-none placeholder:text-blackOpacity-500 h-[40px] peer`}
                          />
                          <div className='absolute bottom-0 h-[3px] w-full  -100 after:content-[""] after:absolute after:h-[3px] after:w-0  peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear'></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <p className="text-base max-mxs:text-sm text-white font-bold mb-3 max-mxs:text-center">
                Have not received OTP?{" "}
                <button
                  type="button"
                  onClick={() => handleResendOtp()}
                  className=" "
                >
                  Send again.
                </button>
              </p>
              <PrimaryButton type="submit" className="w-full mt-7">
              <span className="uppercase">{loading ? "Loading..." : "Submit"}</span>
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
