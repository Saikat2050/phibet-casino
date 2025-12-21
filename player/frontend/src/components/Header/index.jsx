"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../assets/images/logo/logo.svg";
import Mobilelogo from "../../assets/images/logo/Mobilelogo.svg";
import HeaderOptions from "./HeaderOptions";
import MobileMenuDropdown from "./MobileMenuDropdown";
import RedirectLinkToLobby from "./RedirectLinkToLobby";
import SearchIcon from "../../assets/icons/SearchIcon";

const Header = () => {
  return (
    <header className=" bg-background h-header-height flex items-center justify-between px-6 2xl:px-11 fixed top-0 w-full gap-2 2xl:gap-4 z-[22]">
      <div className="text-30 2xl:text-40 font-black uppercase grow shrink-0">
        Phi <span className="text-transparent bg-primaryButtonGradient bg-clip-text">Bet</span>
      </div>
      <div className="flex items-center justify-center gap-4 grow max-md:hidden">
        <a href="#" className="h-10 2xl:h-[3.75rem] px-2 flex items-center justify-center rounded-lg text-14 2xl:text-16 text-tertiary-300 bg-tab-bg border border-solid border-primary-border capitalize">Tournament</a>
        <a href="#" className="h-10 2xl:h-[3.75rem] px-2 flex items-center justify-center rounded-lg text-14 2xl:text-16 text-tertiary-300 bg-tab-bg border border-solid border-primary-border capitalize">Bonus</a>
        <div className="flex items-center pl-2 2xl:pl-5 max-xl:hidden">
          <div className="wallet-box-mask flex items-center min-w-[7.6875rem] max-2xl:h-10">
            <div className="text-16 2xl:text-20 font-bold text-white wallet-text-shadow pl-5 pr-10">
              2,5486
            </div>
          </div>
          <div className="-ml-1 relative p-0.5 size-9 2xl:size-[3.125rem] rounded-px_32 flex items-center overflow-hidden justify-center shrink-0 text-16 2xl:text-20 font-bold text-white uppercase shadow-coinShadow">
            <span className="absolute bg-borderGradient z-[1] w-full h-full rounded-px_30"></span>
            <span className="bg-primaryButtonGradient relative z-[2] flex items-center justify-center rounded-px_28 w-full h-full">USD</span>
          </div>
        </div>

        <div className="max-w-[28.125rem] 2xl:max-w-[39.1875rem] w-full pl-2 2xl:pl-10 max-xl:hidden">
          <div className="search-box-mask max-2xl:h-10">
            <SearchIcon className='size-4 2xl:size-6 absolute left-2.5 top-1/2 -translate-y-1/2 ' />
            <input type="text" className="h-full bg-transparent relative z-[2] w-full pl-10 pr-32 focus:outline-none text-20 text-white" />
            <button className="cursor-pointer capitalize text-12 2xl:text-16 text-blackOpacity-100 h-7 2xl:h-9 bg-tertiary-300 max-w-20 2xl:max-w-[6.6875rem] w-full rounded-lg absolute right-2.5 top-1/2 -translate-y-1/2 z-[3]">search</button>
          </div>
        </div>

      </div>
      <HeaderOptions />
    </header>
  );
};

export default Header;
