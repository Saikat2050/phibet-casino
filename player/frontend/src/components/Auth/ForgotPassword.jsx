"use client";

import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";
import logo from "../../assets/images/logo/logo.svg";
import Image from "next/image";
import modalImg from "../../../public/assets/img/png/forgot-password.png";
import { PrimaryButton } from "../Common/Button";
import { forgotPassword } from "@/actions";
import { toast } from 'react-toastify';

// {
//   "newPasswordKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNGI5MTYzMC05ZGUwLTRjY2YtOGY4OS0zODRlMjBkNWRhMTAiLCJpYXQiOjE3MjcwNzY1MTEsImV4cCI6MTcyNzE2MjkxMX0.vGeITMxYFfRI3LQwQ46NOYvNjsZSe_MPGjycjGh4NCg",
//   "password": "UmVzZXRAMTIz",
//   "confirmPassword": "UmVzZXRAMTIz"
// }
const ForgotPassword = () => {
  const { clearModals } = useModalsStore();
  const [formState, formAction] = useFormState(forgotPassword);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData.entries());

    await formAction(formDataObject);
  };

  useEffect(() => {
    if (formState?.data) {
      toast.success(formState?.message);
      clearModals();
    } else if (formState?.apiErrors) {
      toast.error(formState?.apiErrors || "Failed to Login. Please try again.");
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
                clearModals();
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
                Check you email
              </h1>
              <p className="text-sm max-md:text-xs text-white pb-3">
                Please enter your email. We will send you a reset password link.
              </p>
              <form className="" onSubmit={handleSubmit}>
                <div className="mb-[42px]">
                  <label
                    className="block text-xs max-md:text-xs font-normal text-white mb-1 capitalize"
                    htmlFor="email"
                  >
                    email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="jabskjags@gmail.com"
                    className={`  h-11 placeholder  text-white text-sm rounded-[5px] block w-full px-4 py-3 border-2 border-solid ${
                      formState?.apiErrors
                        ? " border-red-1"
                        : "border-green-300"
                    }  focus:border-green-300 focus:  focus:outline-none`}
                  />
                  {formState?.apiErrors && (
                    <p className="text-red-1 text-[10px] font-bold mt-1">
                      {formState?.apiErrors}
                    </p>
                  )}
                </div>
                <PrimaryButton type="submit" className="mt-5 w-full">
                  send link
                </PrimaryButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
