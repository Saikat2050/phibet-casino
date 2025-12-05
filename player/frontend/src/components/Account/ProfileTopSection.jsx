"use client";

import Copy from "@/assets/images/Copy";
import Image from "next/image";
import React from "react";
import ProfileImg from "@/assets/images/default-profile.svg";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { updateProfilePic } from "@/actions";
import { toast } from 'react-toastify';
import useUserStore from "@/store/useUserStore";
import Help from "@/assets/images/Help";

const ProfileTopSection = ({ className = "" }) => {
  const pathname = usePathname();
  const [isScreenLarge, setIsScreenLarge] = useState(true);
  const [profileImage, setProfileImage] = useState(ProfileImg);
  const {
    user,
  } = useUserStore();
  // Check for screen size greater than 768px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenLarge(window.innerWidth >= 768);
    };

    checkScreenSize(); // Run on mount
    window.addEventListener("resize", checkScreenSize); // Update on resize

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = new FormData();

      data.append("image", file);


      const res = await updateProfilePic(data);


      if (res?.data?.data) {
      } else {
        toast.error("Something went wrong");
      }

      // Optionally set the selected image as a preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Render null if pathname is not '/user' and screen size is not greater than 768px
  if (pathname !== "/user" && !isScreenLarge) return null;

  return (
    <div
      className={`flex flex-col lg:flex-row justify-between gap-[1.25rem] mb-3 ${className}`}
    >
      {/* min-w-[280px] add this later in below classes */}
      <div className="relative min-h-[120px] before:content-[''] before:absolute before:inset-0 before:w-full w-full before:h-full before:bg-profileImgBg before:bg-no-repeat inset-0 overflow-hidden flex items-center gap-5 max-xl:gap-4 max-nlg:gap-3 max-md:gap-2   px-4 py-3 rounded-[.5rem] profileImgSection ">
        <div className="relative z-10 flex items-center gap-[0.625rem] profileImgDiv w-full">
          <Image
            src={profileImage}
            width={80}
            height={80}
            className="w-[80px] rounded-full"
            alt="logo"
          />

          <div className="flex items-center justify-between profileTextDiv">
            <h2 className={`${user?.uniqueId && "has-tooltip"} text-base font-bold leading-[21px] text-white flex flex-row gap-[0.625rem]`}>
              <span className="tooltip rounded w-[350px] text-sm shadow-lg p-1   text-white -mt-8" >{user?.uniqueId}</span>
              ID {<span className="truncate max-w-[60px] " >{user?.uniqueId || user?.userId}</span>} <Copy userId={user?.uniqueId || user?.userId} className="hover:text-white" />
            </h2>



            {/* <div className="flex items-center gap-2 mt-2.5 max-xl:mt-0 changePhoto">
              <label htmlFor="uploadImg" className="">
                <p className="text-[8px] font-normal cursor-pointer text-white">
                  Change Photo
                </p>
                <input
                  type="file"
                  id="uploadImg"
                  className="hidden"
                  onChange={handleProfileUpload}
                />
              </label>
            </div> */}
          </div>

        </div>
        <div className="block sm:hidden z-10" title="Help">
          <button
            onClick={()=>window.open("https://help.phibet.com/", "_blank")}
            className="h-10 w-10   bg-transparent border-none outline-none"
            style={{ cursor: "pointer" }}
          >
            <Help />
          </button>
        </div>
      </div>


      {/* <div className="relative py-1 max-w-full lg:max-w-[465px] min-h-[120px] overflow-hidden w-full   rounded-lg shadow-bottomShadow  before:absolute before:w-[90%] before:h-[70%] before:   before:top-[50%] before:left-[50%] before:-translate-x-[50%] before:-translate-y-[50%]  before:filter before:blur-[2.5rem] before:rounded-full levelSection flex items-center">
        <div className="text-right flex justify-end absolute right-5 top-2.5 viewLevelBtn">
          <a
            href="javascript:void(0)"
            className="text-white text-[0.625rem] font-bold"
          >
            View all levels
          </a>
        </div>
        <div className="relative z-10 flex items-center  gap-7 w-full px-5 mt-1.5 levelProgress">
          <Image
            src={level_1}
            height={"72px"}
            width={"92px"}
            className="w-[5.75rem] h-[4.5rem]"
            alt="logo"
          />

          <div className="max-w-60 w-full progressBar">
            <h4 className="text-[1rem] mb-[6px] font-bold leading-[21.86px] max-xl:leading-tight text-white ">
              My Level: Demo 1

            </h4>
            <div className="w-full   rounded-full h-2.5 mb-2">
              <div className="bg-white h-2.5 rounded-full w-5"></div>
            </div>

            <p className="text-[.8125rem] text-white font-normal">
              Receive rewards with each new Level
            </p>
          </div>
        </div>
      </div> */}

      {/* <div className="bg-gradientCard bg-cover bg-center min-h-[120px] max-w-full  lg:max-w-[465px] max-nlg:max-w-full overflow-hidden w-full rounded-lg flex justify-between shadow-bottomShadow px-[1.25rem] rewardSection">
        <div className="relative z-10 flex items-center  gap-[1.875rem] w-full px-[1.25rem]]">
          <Image
            src={level_2}
            height={"92px"}
            width={"72px"}
            className="max-w-[7.375rem] max-xl:max-w-[5.8125rem] w-full"
            alt="logo"
          />
          <div className="max-w-60 w-full">
            <h4 className="text-base mb-1.5 font-bold leading-[21.86px] max-xl:leading-tight text-white ">
              Weekly Rewards
            </h4>
            <div className="w-full   rounded-full h-2.5 mb-2">
              <div className="bg-white h-2.5 rounded-full w-5"></div>
            </div>
            <h3 className="text-3xl text-white font-bold">
              <span className="text-3xl text-white font-bold">
                3
              </span>
              /7
            </h3>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileTopSection;
