"use client";
import React, { useState,useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '@seontechnologies/seon-id-verification/styles';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useRouter, usePathname } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { getProfile } from "@/actions";
import { getCookie } from "@/utils/clientCookieUtils";
import KycCompletedModal from "../KycCompletedModal";
import useModalsStore from "@/store/useModalsStore";

const KYCSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  const [isKycStarted, setIsKycStarted] = useState(false);
  const { user, setUser } = useUserStore();
  const { openModal } = useModalsStore();
  const router = useRouter();
  const pathname = usePathname();
  const userToken = getCookie("accessToken");

  const getUserProfile = async () => {
    const res = await getProfile();
    setUser(res);
  };

  useEffect(() => {
    const hasIncompleteProfile = user?.kycStatus === "K1";
    if (hasIncompleteProfile && !hasShownToast) {
      setHasShownToast(true);
      setTimeout(() => {
        toast.dismiss();
        router.replace("/user/profile");
        toast.error("Please complete profile first");
      }, 1000);
    }
  }, [user, router, hasShownToast]);

  useEffect(() => {
    if (
      pathname === "/user/kyc" &&
      (user?.kycStatus === "K4" || user?.kycStatus === "K5")
    ) {
      openModal(<KycCompletedModal close={true} />);
      router.push("/");
    }
  }, [pathname]);

  const startKycProcess = async () => {
    setIsLoading(true);
    setIsKycStarted(true);
    try {
      const module = await import('@seontechnologies/seon-id-verification');
      const SeonIdVerificationService = module.SeonIdVerificationService;
      const config = {
        baseUrl: process.env.NEXT_PUBLIC_SEON_BASE_URL,
        language: 'en',
        SEONCustomerData: {
          licenseKey: process.env.NEXT_PUBLIC_SEON_LICENSE_KEY,
          referenceId: uuidv4(),
          email: user?.email,
          name: `${user?.firstName} ${user?.lastName}`,
          phoneNumber: user?.phone,
          type: 'id-verification',
          userId: String(user?.userId),
          countryISOCode: 'US',
          address: user?.addressLine_1,
          additionalProperties: {
            kycStatus: user?.kycStatus
          }
        },
        container: "#seon-kyc-container"
      };
      await SeonIdVerificationService.initialize(config);
     
      SeonIdVerificationService.on('error', () =>{
        console.log('error event triggered');
        toast.error("KYC verification failed!");
        router.push("/");
      });
      SeonIdVerificationService.on('start', () =>{
      
        toast.info("KYC verification started!");
        router.push("/");
      });
      SeonIdVerificationService.on('cancelled', () =>{
        console.log('cancelled event triggered');
        toast.info("KYC verification cancelled!");
        router.push("/");
      });
      SeonIdVerificationService.on('completed', () =>{
        toast.success("KYC verification completed!");
        router.push("/");
      });
      SeonIdVerificationService.on('completedFailed', () =>{
        console.log('completedFailed event triggered');
        toast.error("KYC verification failed!");
        router.push("/");
      });
      SeonIdVerificationService.on('completedPending', () =>{
        console.log('completedPending event triggered');
        // toast.info("KYC verification pending!");
        router.push("/");
      });
      SeonIdVerificationService.on('completedSuccess', () =>{
        console.log('completedSuccess event triggered');
        getUserProfile();
        // toast.success("KYC verification completed!");
        router.push("/");
      });


      SeonIdVerificationService.start();
      setIsLoading(false);
    } catch (error) {
      console.error('SEON Initialization error:', error);
      setIsLoading(false);
      setIsKycStarted(false);
    }
  };
  return (
    <div className="py-[30px] px-3 nlg:px-[50px] max-xl:py-6">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <span className="text-white text-sm font-bold capitalize">KYC</span>
      </div>
      {!isKycStarted ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <button
            onClick={startKycProcess}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting KYC...' : 'Start KYC Verification'}
          </button>
        </div>
      ) : (
        <div className="relative w-full min-h-[500px] flex items-center justify-center">
          {isLoading ? (
            <div>Loading KYC module...</div>
          ) : (
            <div id="seon-kyc-container" className="w-full h-full z-[9999]" />
          )}
        </div>
      )}
    </div>
  );
};
export default KYCSection;
