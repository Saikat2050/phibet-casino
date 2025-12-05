"use client";

import React, { useState } from "react";
import Select, { components } from "react-select";
import EyeClose from "../../../public/assets/img/svg/EyeClose";
import { PrimaryButton } from "../Common/Button";
import SelectDownArrow from "../../../public/assets/img/svg/SelectDownArrow";
import { logoutUser, postRsg } from "@/actions";
import { toast } from 'react-toastify';
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import ArrowCircleLeftWhite from "../../../public/assets/img/svg/ArrowCircleLeftWhite";
import Link from "next/link";
import { deleteAllClientCookies } from "@/utils/clientCookieUtils";
import EyeOpen from "../../../public/assets/img/svg/EyeOpen";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const options = [
  { value: "24Hours", label: "24 Hours" },
  { value: "72Hours", label: "72 Hours" },
  { value: "7Days", label: "1 Week" },
  { value: "30Days", label: "1 Month" },
  { value: "6Months", label: "6 Months" },
  { value: "1Year", label: "1 Year" },
  { value: "indefinitely", label: "Permanent" },
];

const ResposibleGaming = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timeFrameError, setTimeFrameError] = useState("");
  const { logout,user,setSelectedCoin } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    setSelectedCoin("GC")
    logoutUser();
    logout();
    deleteAllClientCookies();
    router.push("/");
    router.refresh()
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeFrame) {
      setTimeFrameError("Time frame is required");
      return;
    }

    setTimeFrameError("");

    const data = {
      selfExclusion: "yes",
      selfExclusionTimeDuration: selectedTimeFrame?.value,
      password: btoa(password),
    };

    const res = await postRsg(data);

    if (res?.success) {
      if (res?.data?.isUpdated) {
        handleLogout();
        toast.success("Your account is successfully selfexcluded!");
      } else {
        toast.error("Something went wrong");
      }
    } else {
      toast.error(res?.message || "Failed to claim bonus.");
    }
  };



  return (
    <div className="py-[30px] px-3 nlg:px-[50px] max-xl:py-6 md:min-h-[505px]">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Link
          href="/user"
          className="text-xs text-white font-bold flex items-center justify-center gap-1 leading-none"
        >
          <ArrowCircleLeftWhite /> Back to Menu
        </Link>
        <span className="text-white text-sm font-bold capitalize">Responsible Gaming</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="max-w-[580px] mx-auto">
          <div className="  border border-green-300 rounded-[0.5rem] px-[0.625rem] py-[1rem]  mb-2.5 md:mb-12">
            <div className="mb-12">
              <div className="grid grid-cols-1 items-end gap-y-[25px] gap-x-2.5">
                <div>
                  <label
                    className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[10px]"
                    htmlFor="firstName"
                  >
                    Temporarily Block Your Account
                  </label>
                  <p className="text-[0.625rem] text-white text-normal mb-[0.313rem]">
                  Choose a time frame to block this account. You can select between 24 Hours, 72 Hours, 1 Week, 1 Month, 6 Months, 1 Year, or Permanent. You will need to enter your password to confirm the action.
                  </p>
                  <div className="relative">
                    <Select
                      value={selectedTimeFrame}
                      onChange={setSelectedTimeFrame}
                      options={options}
                      placeholder="Select Time Frame"
                      components={{ DropdownIndicator }}
                      className="coin-select"
                      classNamePrefix="coin"
                      isSearchable={false}
                      styles={{
                        // Fixes the overlapping problem of the component
                        menu: provided => ({ ...provided, zIndex: 9999 })
                      }}
                    />
                    {timeFrameError && (
                      <p className="text-red-500 text-xs mt-2">
                        {timeFrameError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
{user?.signInMethod === "0" &&
          <div className="w-full">
            <label className="text-[.8125rem] font-normal   mb-1 inline-block">
              Enter your password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
              />
             { showPassword? <EyeClose
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle show/hide password
              />: <EyeOpen  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)} />}
            </div>
          </div>}

          <div className="mt-[25px]">
            <PrimaryButton type="submit" className="h-[44px] min-w-[11.3125rem]">
              Save
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResposibleGaming;
