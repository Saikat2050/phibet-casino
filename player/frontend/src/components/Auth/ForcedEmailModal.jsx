"use client";

import useModalsStore from "@/store/useModalsStore";
import React, { useState } from "react";
import Cross from "@/assets/images/Cross";
import logo from "../../assets/images/logo/logo.svg";
import Image from "next/image";
import { PrimaryButton } from "../Common/Button";
import { z } from "zod"; // Import Zod
import { emailSchema } from "@/schemas/profileSchema";
import { facebookLogin } from "@/actions";
import { toast } from 'react-toastify';
import useUserStore from "@/store/useUserStore";
import {  useSearchParams } from "next/navigation";

const ForcedEmailModal = ({
  userData,
  handleFaceBookLogin,
  isForceEmail,
  userIp,
}) => {
  const { clearModals,closeModal } = useModalsStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // State to store validation error
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useUserStore();
  const searchParams = useSearchParams();
  let pid = searchParams.get("pid");
  let cid = searchParams.get("cid");
  let click_id = searchParams.get("click_id");
  const trackSignUpEvent = (signUpData) => {
    try {
      // Validate if dataLayer exists
      if (typeof window === "undefined" || !window.dataLayer) {
        console.warn("DataLayer not available");
        return;
      }

      // Push the sign-up event
      window.dataLayer.push({
        event: "sign_up",
        user_id: signUpData?.userId,
        affiliate_id: signUpData?.affiliateId || "Affiliate ID not available",
        click_id: signUpData?.clickId || "Click ID not available",
      });
    } catch (error) {
      console.error("Error tracking sign-up event:", error);
    }
  };

  const handleForcedLogin = async () => {
    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError("");
    setLoading(true);
    // Update user data and proceed with login
    userData.email = email;
    userData.isForceEmail = isForceEmail;
    const res = await facebookLogin(userData, userIp);
    if (res?.data?.data?.user) {
      setIsLoggedIn(true);
      setUser(res?.data?.data?.user);
      if (res?.data?.data?.user?.newGtmUser) {
        trackSignUpEvent({
          userId: res?.data?.data?.user?.userId,
          affiliateId: pid,
          clickId: click_id || cid,
        });
      }
      closeModal();
      clearModals();
      setLoading((prev) => !prev);
    } else {
      toast.error(res?.message || "Failed to login with Facebook..");
      // setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl w-full">
      <div className="  rounded-lg p-2">
        <div className="  rounded-lg p-6 max-md:p-4 flex items-center justify-center z-[2] relative">
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

        <div className="flex-col max-w-xl w-full mx-auto flex max-md:flex-col items-center gap-2 max-md:gap-2 justify-between p-7 max-md:p-4">
          <div className="relative z-[2] w-full">
            <h1 className="text-2xl max-md:text-xl font-bold text-white pb-3">
              Re-enter Your Email to Continue
            </h1>
            <p className="text-sm max-md:text-xs text-white pb-3">
              We’re having trouble connecting to Facebook. Please re-enter your
              email to verify your account and continue.
            </p>
            <div className="w-full">
              <label
                className="block text-sm max-md:text-xs font-normal text-white mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                type="email"
                className="  placeholder  text-white text-sm rounded-md block w-full px-4 py-3 border-2 border-solid border-transparent focus:border-green-300 focus:  focus:outline-none"
                placeholder="Email"
              />
              {error && (
                <p className="text-red-1 text-[12px] font-semibold mt-1">
                  {error}
                </p>
              )}
            </div>
          </div>
          <PrimaryButton
            className="mt-5 w-full"
            onClick={() => handleForcedLogin()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Proceed"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ForcedEmailModal;
