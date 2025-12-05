"use client";

import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";
import { PrimaryButton } from "../Common/Button";
import { resetForgotPassword } from "@/actions"; // Import the reset password action
import { toast } from 'react-toastify';
import logo from "@/assets/images/logo/logo.svg";
import Image from "next/image";
// import modalImg from "../../../public/assets/img/png/forgot-password.png";
import modalImg from "../../../public/assets/img/png/forgot-password.png";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordModal = ({ token }) => {
  const router = useRouter();
  const { clearModals } = useModalsStore();
  const [formState, formAction] = useFormState(resetForgotPassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please try again.");
      return;
    }

    setPasswordError("");

    const formData = {
      password,
      confirmPassword,
      newPasswordKey: token,
    };
    await formAction(formData);
  };

  useEffect(() => {
    if (formState?.data) {
      toast.success(formState?.message);
      clearModals();
      router.push("/");
    } else if (formState?.apiErrors) {
      toast.error(formState?.apiErrors || "Failed to reset password.");
    }
  }, [formState]);

  return (
    <>
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

            <button
              onClick={() => {
                router.push("/");
              }}
              className="absolute top-3 right-3 hover:rotate-90 transition-transform duration-200"
            >
              <Cross />
            </button>
          </div>

          <div className="max-w-xl w-full mx-auto flex max-md:flex-col items-center gap-9 max-md:gap-2 justify-between p-7 max-md:p-4">
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
                Reset your password
              </h1>

              <form className="" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-xs max-md:text-xs font-normal text-white mb-1 capitalize"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="New Password"
                      className={`  h-11 placeholder  text-white text-sm rounded-[5px] block w-full px-4 py-3 border-2 border-solid ${
                        formState?.apiErrors || passwordError
                          ? " border-red-1"
                          : "border-green-300"
                      }  focus:border-green-300 focus:  focus:outline-none`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs max-md:text-xs font-normal text-white mb-1 capitalize"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      id="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`  h-11 placeholder  text-white text-sm rounded-[5px] block w-full px-4 py-3 border-2 border-solid ${
                        formState?.apiErrors || passwordError
                          ? " border-red-1"
                          : "border-green-300"
                      }  focus:border-green-300 focus:  focus:outline-none`}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                      onClick={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs font-bold mt-1">
                    {passwordError}
                  </p>
                )}
                {formState?.apiErrors && (
                  <p className="text-red-500 text-xs font-bold mt-1">
                    {formState?.apiErrors}
                  </p>
                )}

                <PrimaryButton type="submit" className="mt-5 w-full">
                  Reset Password
                </PrimaryButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordModal;
