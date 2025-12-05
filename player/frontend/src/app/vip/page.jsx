"use client";
import ProfileTopSection from "@/components/Account/ProfileTopSection";
import React from "react";
import Image from "next/image";
import Level1 from "../../../public/assets/img/png/vip-level-1.png";
import Level2 from "../../../public/assets/img/png/vip-level-2.png";
import Level3 from "../../../public/assets/img/png/vip-level-3.png";
import Level4 from "../../../public/assets/img/png/vip-level-4.png";
import Level5 from "../../../public/assets/img/png/vip-level-5.png";
import Level6 from "../../../public/assets/img/png/vip-level-6.png";

import GCIcon from "../../../public/assets/img/svg/GCIcon";
import SCIcon from "../../../public/assets/img/svg/SCIcon";
import rightIcon from "../../../public/assets/img/png/right-icon.png";
import clockIcon from "../../../public/assets/img/png/clock-icon.png";
import { getVipTiers, getVipTiersAction } from "@/actions";
import useUserStore from "@/store/useUserStore";
import { useEffect } from "react";
import { useState } from "react";

const levels = {
  1: {
    heightClass: `max-2xl:h-[125px] h-[150px]`,
    Image: Level1,
  },
  2: {
    heightClass: `max-2xl:h-[175px] h-[225px]`,
    Image: Level2,
  },
  3: {
    heightClass: `max-2xl:h-[225px] h-[275px]`,
    Image: Level3,
  },
  4: {
    heightClass: `max-2xl:h-[275px] h-[325px]`,
    Image: Level4,
  },
  5: {
    heightClass: `max-2xl:h-[325px] h-[375px]`,
    Image: Level5,
  },
  6: {
    heightClass: `max-2xl:h-[375px] h-[425px]`,
    Image: Level6,
  },
};

async function VIp() {
  const [data, setData] = useState();
  const { user: userDetails } = useUserStore();
  useEffect(() => {
    const fetchVipTiers = async () => {
      const tiers = await getVipTiersAction();
      setData(tiers);
    };
    fetchVipTiers();
  }, []);

  return (
    <>
      <div>
        <ProfileTopSection
          className="[&>.profileImgSection>.profileImgDiv>.profileTextDiv>.changePhoto]:hidden
       [&>.levelSection]:max-w-full
       [&>.levelSection>.viewLevelBtn]:hidden
       [&>.levelSection>.levelProgress>.progressBar]:max-w-[623px]
       [&>.rewardSection]:hidden"
        />

        <div className="pt-12 max-w-[1186px] w-full mx-auto pb-5">
          <div className="flex items-end w-full mx-auto overflow-x-auto relative max-xl:pb-2.5">
            {data?.map((tier, index) => {
              const currentLevel =
                userDetails?.tierDetail &&
                tier?.level <= userDetails?.tierDetail?.currentTier?.level;
              return (
                <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
                  <div
                    className={`flex flex-col items-center w-36 min-w-36 z-[2] relative ${
                      currentLevel ? "" : "grayscale"
                    }`}
                  >
                    <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-5-">
                      <Image
                        src={levels[tier.level].Image}
                        height={1000}
                        width={1000}
                        className="w-full"
                        alt="level1"
                      />
                    </div>
                    <div
                      className={`w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end ${
                        levels[tier.level].heightClass
                      }`}
                    >
                      <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                        <GCIcon /> {tier?.bonusGc}
                      </p>
                      <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                        <SCIcon /> {tier?.bonusSc}
                      </p>
                      <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                        {" "}
                        {tier?.requiredXp} XP
                      </p>
                    </div>

                    <div className="-mt-6">
                      <Image
                        src={currentLevel ? rightIcon : clockIcon}
                        height={1000}
                        width={1000}
                        className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                        alt="level1"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                    <span id="ProgressLabel" className="sr-only">
                      Loading
                    </span>

                    <span
                      role="progressbar"
                      aria-labelledby="ProgressLabel"
                      aria-valuenow="75"
                      className="block  "
                    >
                      <span
                        className={`block h-4 bg-white ${
                          currentLevel
                            ? tier.level ==
                              userDetails.tierDetail.currentTier.level
                              ? "w-1/2"
                              : "w-full"
                            : "w-0"
                        } `}
                      ></span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
              <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative">
                <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-10">
                  <Image
                    src={Level2}
                    height={1000}
                    width={1000}
                    className="w-full"
                    alt="level1"
                  />
                </div>
                <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[200px] h-[230px]">
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <GCIcon /> 100
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <SCIcon /> 0.50
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    {" "}
                    2,500 XP
                  </p>
                </div>

                <div className="-mt-6">
                  <Image
                    src={rightIcon}
                    height={1000}
                    width={1000}
                    className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                    alt="level1"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow="75"
                  className="block  "
                >
                  <span className="block h-4 bg-white w-1/2"></span>
                </span>
              </div>
            </div>

            <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
              <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative">
                <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-[60px] relative before:content-[''] before:absolute before:w-full before:h-full before:bg-vipLevelBg before:bg-contain before:bg-center before:z-[1] before:scale-[3]">
                  <Image
                    src={Level3}
                    height={1000}
                    width={1000}
                    className="w-full z-[2] relative"
                    alt="level1"
                  />
                </div>
                <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[275px] h-[305px]">
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <GCIcon /> 100
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <SCIcon /> 0.50
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    {" "}
                    2,500 XP
                  </p>
                </div>

                <div className="-mt-6">
                  <Image
                    src={clockIcon}
                    height={1000}
                    width={1000}
                    className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                    alt="level1"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow="75"
                  className="block  "
                >
                  <span className="block h-4 bg-white w-0"></span>
                </span>
              </div>
            </div>

            <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
              <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative grayscale">
                <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-20 ">
                  <Image
                    src={Level4}
                    height={1000}
                    width={1000}
                    className="w-full"
                    alt="level1"
                  />
                </div>
                <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[352px] h-[382px]">
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <GCIcon /> 100
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <SCIcon /> 0.50
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    {" "}
                    2,500 XP
                  </p>
                </div>

                <div className="-mt-6">
                  <Image
                    src={clockIcon}
                    height={1000}
                    width={1000}
                    className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                    alt="level1"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow="75"
                  className="block  "
                >
                  <span className="block h-4 bg-white w-0"></span>
                </span>
              </div>
            </div>

            <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
              <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative grayscale">
                <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-[100px]">
                  <Image
                    src={Level5}
                    height={1000}
                    width={1000}
                    className="w-full"
                    alt="level1"
                  />
                </div>
                <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[428px] h-[458px]">
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <GCIcon /> 100
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <SCIcon /> 0.50
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    {" "}
                    2,500 XP
                  </p>
                </div>

                <div className="-mt-6">
                  <Image
                    src={clockIcon}
                    height={1000}
                    width={1000}
                    className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                    alt="level1"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow="75"
                  className="block  "
                >
                  <span className="block h-4 bg-white w-0"></span>
                </span>
              </div>
            </div>

            <div className="px-6 max-xl:px-3 vipLevel first:pl-10 max-xl:first:pl-6 last:pr-10 max-xl:last:pr-6 relative">
              <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative grayscale">
                <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-[120px]">
                  <Image
                    src={Level6}
                    height={1000}
                    width={1000}
                    className="w-full"
                    alt="level1"
                  />
                </div>
                <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[505px] h-[535px]">
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <GCIcon /> 100
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    <SCIcon /> 0.50
                  </p>
                  <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center">
                    {" "}
                    2,500 XP
                  </p>
                </div>

                <div className="-mt-6">
                  <Image
                    src={clockIcon}
                    height={1000}
                    width={1000}
                    className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                    alt="level1"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow="75"
                  className="block  "
                >
                  <span className="block h-4 bg-white w-0"></span>
                </span>
              </div>
            </div> */}

            {/* <div className="px-6 vipLevel first:pl-10 last:pr-10 relative">
            <div className="flex flex-col items-center w-36 min-w-36 z-[2] relative grayscale">
              <div className="max-w-28 max-2xl:max-w-24 max-xlg:max-w-20 w-full mx-auto -mb-[120px]">
                <Image
                  src={Level6}
                  height={1000}
                  width={1000}
                  className="w-full"
                  alt="level1"
                />
              </div>
              <div className="w-full bg-vipBg px-4 pt-11 max-2xl:pt-4 pb-6 text-center flex flex-col justify-end max-2xl:h-[505px] h-[535px]">
                <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center"><GCIcon /> 100</p>
                <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center"><SCIcon /> 0.50</p>
                <p className="flex items-center gap-2 text-xl max-2xl:text-base font-bold text-white justify-center"> 2,500 XP</p>
              </div>

              <div className="-mt-6">
                <Image
                  src={clockIcon}
                  height={1000}
                  width={1000}
                  className="w-16 max-2xl:w-14 h-16 max-2xl:h-14"
                  alt="level1"
                />
              </div>

            </div>
            <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
            <span id="ProgressLabel" className="sr-only">Loading</span>

            <span
              role="progressbar"
              aria-labelledby="ProgressLabel"
              aria-valuenow="75"
              className="block  "
            >
              <span className="block h-4 bg-white w-0"></span>
            </span>
          </div>
          </div> */}

            {/* <div className="absolute bottom-6 max-2xl:bottom-4 left-0 z-[1] w-full">
            <span id="ProgressLabel" className="sr-only">Loading</span>

            <span
              role="progressbar"
              aria-labelledby="ProgressLabel"
              aria-valuenow="75"
              className="block  "
            >
              <span className="block h-4 bg-white w-1/4"></span>
            </span>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default VIp;
