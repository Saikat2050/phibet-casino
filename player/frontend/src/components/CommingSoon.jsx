'use client'

import Image from 'next/image';
import React from 'react'
import BlockedImage from "@/assets/images/blocked.png";
import logo from "@/assets/images/logo/logo.svg";
import useModalsStore from '@/store/useModalsStore';
import Cross from '@/assets/images/Cross';

const CommingSoon = ({ close }) => {
  const { clearModals } = useModalsStore();
  return (
    <div className="inset-0   flex items-center justify-center relative">
      {close && <button
        onClick={() => clearModals()}
        className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
      >
        <Cross/>
      </button>}
      <div className="max-w-[1250px] relative flex flex-col md:flex-row gap-x-12 items-center z-10 p-10 rounded-lg shadow-lg max-lg:gap-6">
        <div>
          <Image
            src={BlockedImage}
            alt="Access Restricted"
            width={900}
            height={900}
            className="sm:max-md:max-w-[80%] mx-auto xl:max-w-[633px]"
          />
        </div>

        <div className="text-center md:text-center text-white flex-col justify-center items-center max-w-[410px] p-2.5">
          <h2 className="text-xl sm:text-3xl font-bold mb-7">
            Thank you for your interest
          </h2>
          <p className="text-base sm:text-xl font-bold mb-7">
            Unfortunately, This feature is not available at the moment we will provide this as soon as possible.
          </p>
          <p className="text-md text-[#FFB74D] font-semibold mb-2">
            Kind Regards
          </p>

          <Image
            src={logo}
            alt="Phibet Logo"
            width={235}
            height={40}
            className="h-auto sm:flex text-center mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default CommingSoon