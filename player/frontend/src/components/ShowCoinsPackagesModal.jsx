"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlockedImage from "@/assets/images/blocked.png";
import logo from "@/assets/images/logo/logo.svg";
import useModalsStore from "@/store/useModalsStore";
import Cross from "@/assets/images/Cross";
import Link from "next/link";
import { getPackages } from "@/actions";
import GCIcon from "../../public/assets/img/svg/GCIcon";
import SCIcon from "../../public/assets/img/svg/SCIcon";
import PurchaseButton from "./CoinsPackage/PurchaseButton";

import { SkeletonLoader } from "./Skeleton/SkeletonLoader";

const ShowCoinPackageMoal = ({ close }) => {
  const { clearModals } = useModalsStore();
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  /* useEffect(() => {
    if (CoinsPackages_?.packageData?.count == 0 || !CoinsPackages_?.CoinsPackages_?.packageData?.rows.length == 0) {
      getPackagesData()
    }
  }, [CoinsPackages_]);

  async function getPackagesData() {
    let userPackages = await getPackages();
    setCoinsPackages(userPackages);
  } */

  useEffect(() => {
    const fetchPackagesData = async () => {
      setLoading(true);
      try {
        const data = await getPackages();
        setPackagesData(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    // <div className="inset-0   flex items-center justify-center relative">

    <div className="modal-main-container px-3 py-7 w-full mx-auto mt-10   rounded-lg relative">
      {close && (
        <button
          onClick={() => clearModals()}
          className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
        >
          <Cross />
        </button>
      )}
      <h2 className="text-center text-2xl font-bold text-white mb-8 capitalize">
        Select your phibet Package
      </h2>
      <div className="grid grid-cols-3 ml-1.5 mr-4 sm:mx-5">
        <div className="text-base max-lg:text-xs font-bold   bg-orangeShade-2 p-1 rounded-t-lg text-center capitalize  max-w-[162px] max-sm:w-customWidth max-sm:customMaxWidth max-sm:relative max-sm:right-1.5 w-full mx-auto flex items-center justify-center">
          USD
        </div>
        {/* <div className="text-base max-lg:text-xs   bg-white p-1 rounded-t-lg font-bold text-center capitalize max-w-[162px] max-sm:max-w-full w-full mx-auto flex items-center justify-center max-sm:max-w-full">
          sweep coins
        </div> */}
        <p></p>
      </div>
      <div className="max-h-[260px] overflow-auto">
        {packagesData?.packageData?.rows.map((pkg, i) => {
          return (
            <>
              {pkg.isSpecialPackage && (
                <div
                  className={`grid grid-cols-3 mb-1 pl-1.5 pr-4 sm:px-5 last:mb-0 rounded-lg bg-package1 bg-cover bg-center relative overflow-hidden max-sm:rounded-tl-none`}
                >
                  {pkg.isSpecialPackage && (
                    <span className=" animate-springyBounce py-0.5 px-1 mt-1 mx-1.5   max-w-max w-full text-[8px] sm:text-xs  text-center text-white font-bold uppercase absolute top-0 left-0 ribbon-clip pr-3">
                      MOST POPULAR
                    </span>
                  )}
                  <div className=" mx-2 flex items-center justify-center pt-[23px] pb-[13px]">
                    <div className="flex justify-start max-[450px]:max-w-[90px] max-w-[126px] w-full items-center gap-2.5">
                      <GCIcon className="w-5 h-5 animate-coinFlip" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalGcAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center  -200">
                    <div className="inline-flex items-center justify-start gap-2.5 py-1 px-2 max-w-[100px] w-full">
                      <SCIcon className="w-5 h-5 animate-coinFlip" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalScAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-3 mb-1 max-sm:pl-2.5">
                    <PurchaseButton pkg={pkg} />
                    {pkg.previousAmount > 0 && (
                      <span className="text-xs max-xl:text-[10px] text-lightGray-1 flex items-center gap-1 font-bold capitalize">
                        was
                        <span className="relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-lightGray-1 before:top-1/2 before:-translate-Y-1/2 before:rotate-[-14deg]">
                          {pkg.previousAmount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/*
              {i == 1 && (
                <div
                  className={`grid grid-cols-3 mb-1 px-5 last:mb-0 rounded-lg bg-pc1 bg-cover bg-center relative overflow-hidden`}
                >
                  <span className="  max-w-24 w-full text-xs h-4 text-center text-white font-bold uppercase absolute top-0 left-0 ribbon-clip pr-3">
                    best deal
                  </span>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2.5">
                      <GCIcon className="w-5 h-5" />
                      <p className="text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalGcAmt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center  -200">
                    <div className="flex items-center justify-center gap-2.5 py-1 px-2 w-full">
                      <SCIcon className="w-5 h-5" />
                      <p className="text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalScAmt}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-2.5 mb-1">
                    <PurchaseButton pkg={pkg} />

                    <span className="text-xs max-xl:text-[10px] text-lightGray-1 flex items-center gap-1 font-bold capitalize">
                      was
                      <span className="relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-lightGray-1 before:top-1/2 before:-translate-Y-1/2 before:rotate-[-14deg]">
                        {pkg.amount}
                      </span>
                    </span>
                  </div>
                </div>
              )} */}

              {!pkg.isSpecialPackage && (
                <div
                  key={i}
                  className={`grid grid-cols-3 mb-1 pl-1.5 pr-4 sm:px-5 last:mb-0 rounded-lg  `}
                >
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center justify-start gap-2.5 py-1 px-2 max-w-[140px] w-full">
                      <GCIcon className="w-5 h-5" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalGcAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center  ">
                    <div className="inline-flex items-center justify-start gap-2.5 py-1 px-2 max-w-[100px] w-full">
                      <SCIcon className="w-5 h-5" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalScAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-2.5 mb-1 max-sm:pl-2.5">
                    <PurchaseButton pkg={pkg} />

                    {/* <span className="text-xs max-xl:text-[10px] text-lightGray-1 flex items-center gap-1 font-bold capitalize">
                      was
                      <span className="relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-lightGray-1 before:top-1/2 before:-translate-Y-1/2 before:rotate-[-14deg]">
                        {pkg.amount}
                      </span>
                    </span> */}
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
    // </div>
  );
};

export default ShowCoinPackageMoal;
