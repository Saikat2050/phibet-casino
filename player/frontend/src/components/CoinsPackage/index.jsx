import React from "react";
import { getPackages } from "@/actions";
import GCIcon from "../../../public/assets/img/svg/GCIcon";
import SCIcon from "../../../public/assets/img/svg/SCIcon";
import PurchaseButton from "./PurchaseButton";

const CoinsPackage = async () => {
  const response = await getPackages();
  return (
    <div className="modal-main-container px-3 py-7 w-full mx-auto mt-10   rounded-lg">
      <h2 className="text-center text-2xl font-bold text-white mb-8 capitalize">
        Select your phibet Package
      </h2>
      <div className="grid grid-cols-3">
        <p className="text-base max-lg:text-xs font-bold text-white capitalize">
USD        </p>
        {/* <div className="text-base max-lg:text-xs   bg-white p-1 rounded-t-lg font-bold text-center capitalize max-w-[162px] w-full mx-auto">
          sweep coins
        </div> */}
        <p></p>
      </div>
      <div className="max-h-[260px] overflow-auto">
        {response?.packageData?.rows.map((pkg, i) => {
          return (
            <>
              {pkg.isSpecialPackage && (
                <div
                  className={`grid grid-cols-3 mb-1 pl-1.5 pr-4 sm:px-5 last:mb-0 rounded-lg bg-package1 bg-cover bg-center relative overflow-hidden`}
                >
                  {pkg.isSpecialPackage && (
                    <span className=" py-0.5 px-1   max-w-max w-full text-[8px] sm:text-xs  text-center text-white font-bold uppercase absolute top-0 left-0 ribbon-clip pr-3">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="flex items-center justify-center pt-[23px] pb-[13px]">
                    <div className="flex items-center gap-2.5">
                      <GCIcon className="w-5 h-5" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalGcAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center  -200">
                    <div className="inline-flex items-center justify-center md:justify-start gap-2.5 py-1 px-2 max-w-[100px] w-full">
                      <SCIcon className="w-5 h-5" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalScAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-3 mb-1 max-sm:pl-2.5">
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
                    <div className="flex items-center gap-2.5">
                      <GCIcon className="w-5 h-5" />
                      <p className="mb-0 text-base text-white font-bold max-xxm:text-xs">
                        {pkg.totalGcAmt
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center  ">
                    <div className="inline-flex items-center justify-center md:justify-start gap-2.5 py-1 px-2 max-w-[100px] w-full">
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
  );
};

export default CoinsPackage;
