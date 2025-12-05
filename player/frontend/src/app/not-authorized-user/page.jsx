'use client'
import Image from 'next/image'
import React from 'react'
import logo from "@/assets/images/logo/logo.svg";
import BlockedImage from "@/assets/images/blocked.png";
import { useRouter } from 'next/navigation';
import Cross from '@/assets/images/Cross';
const NotAuthorizedUser = () => {

  const router = useRouter();
  return (
    <div className="z-[2] relative mx-auto">
      <div className="flex flex-col min-h-dvh">
        <div className="flex-grow max-w-7xl max-2xl:px-4 w-full max-sm:px-3 max-md:my-8 mx-auto my-10">
          <div className="inset-0   flex items-center justify-center relative">
           <button
              onClick={() => router.push('/')}
              className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
            >
              <Cross />
            </button>
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
                  You are Not Authorized User to access the site.
                </h2>

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
        </div>
      </div>
    </div>
  )
}

export default NotAuthorizedUser