"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { PrimaryButton, SecondaryButton } from "../Common/Button";
import Social1 from "../../assets/images/Social1.svg";
import Social2 from "../../assets/images/Social2.svg";
import Social3 from "../../assets/images/Social3.svg";
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";
import { useFormState } from "react-dom";
import {
  appleLogin,
  facebookLogin,
  getWelcomePurchaseBonus,
  googleLogin,
  signupAction,
} from "@/actions";
import { toast } from 'react-toastify';
import Login from "./Login";
import OtpVerification from "./OtpVerification";
import { useGoogleLogin } from "@react-oauth/google";
import useUserStore from "@/store/useUserStore";
import AppleLogin from "react-apple-login";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCookie } from "@/utils/clientCookieUtils";
import ForcedEmailModal from "./ForcedEmailModal";
import { useIP } from "@/utils/ipUtils";
import UserIcon from "../../assets/icons/UserIcon";
import LockIcon from "../../assets/icons/LockIcon";
import EyeOpenIcon from "../../assets/icons/EyeOpenIcon";
import EyeCloseIcon from "../../assets/icons/EyeCloseIcon";
import useSignup from "@/hooks/useSignup";

const Signup = ({ className = "", from = "" }) => {
  const {
    appleScriptLoaded,
    formState,
    isInitialLoading,
    isPending, // use isPending instead of isLoading
    isLoadingGoogle,
    isLoadingFacebook,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isTermsAccepted,
    setIsTermsAccepted,
    updateTermsAccepted,
    handleSubmit,
    handleGoogleLoginWithDelay,
    handleFacebookClickWithDelay,
    handleAppleLogin,
    openModal,
    closeModal,
    OtpVerification,
    Signup,
  } = useSignup();
  return (
    <div className={`w-full loggin ${className}`}>
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-12 h-12 animate-spin border-t-secondary-500"></div>
          <span className="ml-4 text-white text-lg">Processing...</span>
        </div>
      )}
      <form
        
        onSubmit={handleSubmit}
      >
        <div className="mb-5 w-full">
          <label className="block text-10 capitalize text-label-color mb-1">
            First Name
          </label>
          <div className='relative group'>
            <UserIcon className='size-5.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100' />
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="firstName"
              id="firstName"
              type="text"
              placeholder="Enter first name"
              className={`text-14 text-white w-full border-none bg-transparent p-2 pl-10 placeholder-placeholderColor placeholder:text-normal-14 focus:border-none focus-visible:outline-none placeholder:text-placeholder-color h-10 peer `}
            />
            <div className={`absolute bottom-0 h-0.5 w-full before:content-[""] before:absolute before:w-0.5 before:h-0.5 before:bg-secondary-500 before:left-9 before:top-0 after:content-[""] after:absolute after:h-0.5 after:w-0 after:bg-inputBordergradient peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear ${formState?.zodErrors?.firstName ? 'bg-secondary-500' : 'bg-input-border'}`}>
            </div>
          </div>
          {formState?.zodErrors?.firstName?.[0] && (
            <p className="text-secondary-500 text-12 mt-1">{formState?.zodErrors?.firstName[0]}</p>
          )}
        </div>
        <div className="mb-5 w-full">
          <label className="block text-10 capitalize text-label-color mb-1">
            Last Name
          </label>
          <div className='relative group'>
            <UserIcon className='size-5.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100' />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              name="lastName"
              id="lastName"
              type="text"
              placeholder="Enter last name"
              className={`text-14 text-white w-full border-none bg-transparent p-2 pl-10 placeholder-placeholderColor placeholder:text-normal-14 focus:border-none focus-visible:outline-none placeholder:text-placeholder-color h-10 peer `}
            />
            <div className={`absolute bottom-0 h-0.5 w-full before:content-[""] before:absolute before:w-0.5 before:h-0.5 before:bg-secondary-500 before:left-9 before:top-0 after:content-[""] after:absolute after:h-0.5 after:w-0 after:bg-inputBordergradient peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear ${formState?.zodErrors?.lastName ? 'bg-secondary-500' : 'bg-input-border'}`}>
            </div>
          </div>
          {formState?.zodErrors?.lastName?.[0] && (
            <p className="text-secondary-500 text-12 mt-1">
              {formState?.zodErrors?.lastName[0]}
            </p>
          )}
        </div>
        <div className="mb-5 w-full">
          <label className="block text-10 capitalize text-label-color mb-1">
            Email
          </label>
          <div className='relative group'>
            <UserIcon className='size-5.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100' />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              type="email"
              placeholder="Enter email id"
              className={`text-14 text-white w-full border-none bg-transparent p-2 pl-10 placeholder-placeholderColor placeholder:text-normal-14 focus:border-none focus-visible:outline-none placeholder:text-placeholder-color h-10 peer `}
            />
            <div className={`absolute bottom-0 h-0.5 w-full before:content-[""] before:absolute before:w-0.5 before:h-0.5 before:bg-secondary-500 before:left-9 before:top-0 after:content-[""] after:absolute after:h-0.5 after:w-0 after:bg-inputBordergradient peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear ${formState?.zodErrors ? 'bg-secondary-500' : 'bg-input-border'}`}>
            </div>
          </div>
          {formState?.zodErrors?.email?.[0] && (
            <p className="text-secondary-500 text-12 mt-1">
              {formState?.zodErrors?.email[0]}
            </p>
          )}
        </div>
        <div className="mb-5 w-full">
          <label className="block text-normal-10 capitalize text-labelColor mb-1">
            Password
          </label>
          <div className='relative group'>
            <LockIcon className='size-5.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100' />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="********"
              className={`text-14 text-white w-full border-none bg-transparent p-2 pl-10 placeholder-placeholderColor placeholder:text-normal-14 focus:border-none focus-visible:outline-none placeholder:text-placeholder-color h-10 peer`}
            />
            {isPasswordVisible ? (
              <EyeOpenIcon
                className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 "
                onClick={() => setIsPasswordVisible(false)}
              />
            ) : (
              <EyeCloseIcon
                className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2"
                onClick={() => setIsPasswordVisible(true)}
              />
            )}
            <div className={`absolute bottom-0 h-0.5 w-full before:content-[""] before:absolute before:w-0.5 before:h-0.5 before:bg-secondary-500 before:left-9 before:top-0 after:content-[""] after:absolute after:h-0.5 after:w-0 after:bg-inputBordergradient peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear ${formState?.zodErrors?.password ? 'bg-secondary-500' : 'bg-inputBorder'}`}>
            </div>
          </div>
          {formState?.zodErrors?.password?.[0] && (
            <p className="text-secondary-500 text-sm mt-[4px] font-normal leading-[21px]">
              {formState?.zodErrors?.password[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 pb-5">
          <input
            type="checkbox"
            checked={isTermsAccepted.termsAndConditions}
            onChange={() => updateTermsAccepted("termsAndConditions", !isTermsAccepted.termsAndConditions)}
            className='appearance-none border-2 rounded border-solid border-input-border size-5 shrink-0 checked:bg-checkIcon checked:bg-contain checked:bg-center checked:bg-no-repeat cursor-pointer'
          />
          <p className="text-12 md:text-16 text-white">
            I agree to the Terms and Conditions
          </p>
        </div>
        <PrimaryButton type="submit" className='w-full md:h-12' disabled={isPending}>
          {isPending ? "Loading..." : "register"}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default Signup;
