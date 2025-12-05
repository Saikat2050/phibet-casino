'use client'

import { getProfile, getUserProfile } from '@/actions';
import { getCookie } from '@/utils/clientCookieUtils';
import { usePathname } from 'next/navigation';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import useUserStore from '@/store/useUserStore';
export const dynamic = "force-dynamic";
const ProfileMainSection = ({ children }) => {
    const pathname = usePathname();
      const userToken = getCookie("accessToken");
    const [isScreenLarge, setIsScreenLarge] = useState(true);
    const {
      logout,
      isLoggedIn,
      clearAllData
    } = useUserStore();
 const router = useRouter();
    useEffect(() => {
        const checkScreenSize = () => {
            setIsScreenLarge(window.innerWidth > 1024);
        };

        checkScreenSize(); // Run on mount
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    useEffect(() => {
        async function callUserProfile() {
          const userProfile = await getProfile();
          const userProfileExist = await getUserProfile();
          if(userProfile?.apiErrors == "Unauthorized or Forbidden" || userProfileExist?.errors?.[0]?.name == "Unauthorized or Forbidden" || userProfileExist?.errors?.[0]?.name == "UnAuthorize"){
            clearAllData();
            router.push("/")
          }
        }

        if(isLoggedIn){
          callUserProfile();
        }

      }, [userToken]);
    if (pathname == '/user' && !isScreenLarge) return null;

    return (
        <div className={`  rounded-lg md:min-h-[627px] nlg:min-h-[665px] w-full md:w-[calc(100%_-_244px)]`}>
            {children}
        </div>
    )
}

export default ProfileMainSection