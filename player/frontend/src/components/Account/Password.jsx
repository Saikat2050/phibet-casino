"use client";

import { useState } from "react";
import EyeOpen from "../../../public/assets/img/svg/EyeOpen";
import EyeClose from "../../../public/assets/img/svg/EyeClose";
import { PrimaryButton } from "../Common/Button";
import { z } from "zod";
import { changePassword } from "@/actions";
import { toast } from 'react-toastify';
import Link from "next/link";
import ArrowCircleLeftWhite from "../../../public/assets/img/svg/ArrowCircleLeftWhite";
import { passwordSchema } from "@/schemas/profileSchema";


function PasswordSetting({ className = "" }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Toggle show/hide for each password input
  const togglePasswordVisibility = (type) => {
    if (type === "old") setShowOldPassword((prev) => !prev);
    if (type === "new") setShowNewPassword((prev) => !prev);
    if (type === "confirm") setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = passwordSchema.parse(formData);

      const data = {
        oldPassword: window.btoa(result.oldPassword),
        newPassword: window.btoa(result.newPassword),
      }

      const res = await changePassword(data)

      if(res?.data?.success) {
        toast.success("Your password is updated successfully!")
      } else if(res?.errors) {
        toast.error(res?.errors?.[0]?.description)
      } else {
        toast.error("Something went wrong")
      }
      setErrors({}); // Clear errors if valid
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

    } catch (error) {
      setErrors(
        error.formErrors?.fieldErrors || {}
      );
    }
  };

  return (
    <div className={`py-[1.875rem] max-xl:py-6 px-3 md:px-[50px]`}>
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Link
          href="/user"
          className="text-xs text-white font-bold flex items-center justify-center gap-1 leading-none"
        >
          <ArrowCircleLeftWhite /> Back to Menu
        </Link>
        <span className="text-white text-sm font-bold capitalize">Change Password</span>
      </div>
      <div className="max-w-[36.3125rem] mx-auto">
        <form onSubmit={handleSubmit} className={`grid gap-y-2.5 gap-x-2.5 ${className}`}>
          <div className="w-full">
            <label className="text-[.8125rem] font-normal   mb-1 inline-block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="**************"
                value={formData.oldPassword}
                onChange={handleChange}
                className={`  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none`}
              />
              <span onClick={() => togglePasswordVisibility("old")} className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                {showOldPassword ? <EyeClose /> : <EyeOpen />}
              </span>
            </div>
            {errors.oldPassword && <p className="text-xs text-red-500">{errors.oldPassword}</p>}
          </div>

          <div className="w-full">
            <label className="text-[.8125rem] font-normal   mb-1 inline-block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="**************"
                value={formData.newPassword}
                onChange={handleChange}
                className={`  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none`}
              />
              <span onClick={() => togglePasswordVisibility("new")} className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                {showNewPassword ? <EyeClose /> : <EyeOpen />}
              </span>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
          </div>

          <div className="w-full">
            <label className="text-[.8125rem] font-normal   mb-1 inline-block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="**************"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none`}
              />
              <span onClick={() => togglePasswordVisibility("confirm")} className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                {showConfirmPassword ? <EyeClose /> : <EyeOpen />}
              </span>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="mt-6">
            <PrimaryButton type="submit" className="min-w-[11.25rem] capitalize text-[1rem]">
              Save
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordSetting;

