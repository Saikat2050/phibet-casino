"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { PrimaryButton, PinkSecondaryButton } from "../Common/Button";
import Social1 from "../../assets/images/Social1.svg";
import Social2 from "../../assets/images/Social2.svg";
import Social3 from "../../assets/images/Social3.svg";
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";
import { useFormState } from "react-dom";
import { appleLogin, facebookLogin, googleLogin, loginAction } from "@/actions";
import { toast } from 'react-toastify';
import Signup from "./Signup";
import useUserStore from "@/store/useUserStore";
import { useGoogleLogin } from "@react-oauth/google";
import ForgotPassword from "./ForgotPassword";
import OtpVerification from "./OtpVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AppleLogin from "react-apple-login";
import ForcedEmailModal from "./ForcedEmailModal";
import { useRouter } from "next/navigation";
import { useIP } from "@/utils/ipUtils";
import UserIcon from '../../assets/icons/UserIcon'
import LockIcon from '../../assets/icons/LockIcon'
import EyeOpenIcon from "../../assets/icons/EyeOpenIcon";
import EyeCloseIcon from "../../assets/icons/EyeCloseIcon";
import useLogin from "@/hooks/useLogin";

const Login = () => {
  const {
    formState,
    email,
    setEmail,
    password,
    isPending,
    setPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isAgreed,
    setIsAgreed,
    handleCloseModal,
    openModal,
    closeModal,
    OtpVerification,
    Signup,
    ForgotPassword,
    formAction,
  } = useLogin();
  return (
    <div className="w-full loggin">
       {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-12 h-12 animate-spin border-t-secondary-500"></div>
          <span className="ml-4 text-white text-lg">Processing...</span>
        </div>
      )}
      <form action={formAction}>
        <div className="mb-5 w-full">
          <label className="block text-10 capitalize text-label-color mb-1">
            Username
          </label>
          <div className='relative group'>
            <UserIcon className='size-5.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100' />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              type="email"
              placeholder="Enter first name"
              className={`text-14 text-white w-full border-none bg-transparent p-2 pl-10 placeholder-placeholderColor placeholder:text-normal-14 focus:border-none focus-visible:outline-none placeholder:text-placeholder-color h-10 peer `}
            />
            <div className={`absolute bottom-0 h-0.5 w-full before:content-[""] before:absolute before:w-0.5 before:h-0.5 before:bg-secondary-500 before:left-9 before:top-0 after:content-[""] after:absolute after:h-0.5 after:w-0 after:bg-inputBordergradient peer-focus:after:w-full after:transition-all after:duration-300 after:ease-linear ${formState?.zodErrors?.email ? 'bg-secondary-500' : 'bg-input-border'}`}>
            </div>
          </div>
          {formState?.zodErrors?.email?.[0] && (
            <p className="text-secondary-500 text-12 mt-1">{formState?.zodErrors?.email[0]}</p>
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
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
            className='appearance-none border-2 rounded border-solid border-input-border size-5 shrink-0 checked:bg-checkIcon checked:bg-contain checked:bg-center checked:bg-no-repeat cursor-pointer'
          />
          <p className="text-12 md:text-16 text-white">
            I agree to the Terms and Conditions
          </p>
        </div>
        <PrimaryButton type="submit" className='w-full md:h-12' disabled={isPending}>
          {isPending ? "Loading..." : "login"}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default Login;
