"use client";

import React from "react";
import ProfileIcon from "../../../public/assets/img/jpg/profile.webp";
import ResponsibleIcon from "../../../public/assets/img/jpg/Responsible.webp";
import TransactionIcon from "../../../public/assets/img/jpg/transaction.webp";
import GameHistoryIcon from "../../../public/assets/img/jpg/game-history.webp";
import PasswordIcon from "../../../public/assets/img/jpg/password.webp";
import VerificationIcon from "../../../public/assets/img/jpg/Verification.webp";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/actions";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import logoutIconWhite from "../../../src/assets/images/LogOutIconWhite.svg";
import useModalsStore from "@/store/useModalsStore";
import GeneralInfoModal from "../Modals/GeneralinfoModal";
import { deleteAllClientCookies } from "@/utils/clientCookieUtils";
import { toast } from 'react-toastify';
import KycCompletedModal from "../KycCompletedModal";
const menuItems = [
  { href: "/user/profile", label: "Profile", icon: ProfileIcon },
  { href: "/user/password", label: "Password", icon: PasswordIcon },
  { href: "/user/transaction", label: "Transaction", icon: TransactionIcon },
  { href: "/user/game-history", label: "Game History", icon: GameHistoryIcon },
  { href: "/user/kyc", label: "KYC", icon: VerificationIcon },
  { href: "/user/redeem", label: "Redeem", icon: PasswordIcon },
  {
    href: "/user/responsible-gaming",
    label: "Responsible Gaming",
    icon: ResponsibleIcon,
  },
  { label: "My Favorite", href: "/favorite", icon: ProfileIcon },
];

function ProfileSidebar({ className = "" }) {
  const pathname = usePathname();
  const [isScreenLarge, setIsScreenLarge] = useState(true);
  const { user , setSelectedCoin} = useUserStore();
  const { openModal } = useModalsStore();
  const router = useRouter();
  const hasIncompleteProfile = user?.kycStatus === "K1";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenLarge(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { logout } = useUserStore();


  const handleLogout = async () => {
    await logoutUser();
    // router.replace("/");
    deleteAllClientCookies();
    setSelectedCoin("USD");
    logout();
    router.replace("/");
    router.refresh()
  };

  if (pathname !== "/user" && !isScreenLarge) return null;
  const handleMenuItemClick = (item) => {
    if (item.href === "/user/kyc") {
      if (!user?.profileCompleted || !user?.phoneVerified) {
        router.replace("/user/profile");
        toast.error("Please complete your profile and verify your phone number first");
        return;
      }

      if (hasIncompleteProfile) {
        router.replace("/user/profile");
        toast.error("Please complete profile first");
        return;
      }

      if (user?.kycStatus === "K4" || user?.kycStatus === "K5") {
        openModal(<KycCompletedModal close={true} />);
        return;
      }

      router.push(item.href);
    } else {
      router.push(item.href);
    }
  };
  return (
    <div className="min-w-[220px]  md:max-w-[220px] max-xl:max-w-[220px] max-md:max-w-full w-full">
      <div
        className={`profile-scrollbar grid grid-cols-2 md:grid-cols-1 gap-[18px] flex-col max-nlg:basis-full max-nlg:max-w-full max-nlg:flex-row  max-nlg:gap-3 max-nlg:items-center max-md:pb-2.5 ${className}`}
      >
        {menuItems
          .filter(
            (item) =>
              !(item.href === "/user/password" && user?.signInMethod !== "0")
          )
          .map((item) => {
            user?.signInMethod;
            const isActive = pathname === item.href;
            const isRedeemPage = item.href === "/user/redeem";
            const isKycEligible =
              user?.kycStatus === "K4" || user?.kycStatus === "K5";
            if (isRedeemPage && !isKycEligible) {
              return (
                <Link
                  key={item.href}
                  href={""}
                  onClick={() => openModal(<GeneralInfoModal />)}
                  className={`relative cursor-pointer ${
                    isActive ? "active" : ""
                  } bg-clip-padding [&.active]:after:rounded-lg [&.active]:after:contents[''] [&.active]:after:absolute [&.active]:after:-inset-[2px] [&.active]:after:-z-[1] [&.active]:after:bg-profileBorderGradient [&.active]:before:content-[''] [&.active]:before:absolute [&.active]:before:inset-0 [&.active]:before:w-full [&.active]:before:h-full [&.active]:before:bg-profileActiveBg [&.active]:before:bg-no-repeat [&.active]:before:bg-right-bottom [&.active>span]:text-white [&.active>span]:font-bold inset-0 border-2 border-solid border-transparent flex items-center   text-base leading-[1.2] break-words max-nlg:text-base max-nlg:leading-[1.2] max-xl:leading-[1.2] max-md:text-[13px] font-normal w-full   rounded-lg py-1 px-2.5 gap-2 capitalize `}
                >
                  <Image
                    src={item.icon}
                    width={80}
                    height={80}
                    className={`w-[4.1875rem] rounded-full ${
                      isActive ? "" : "grayscale"
                    } max-md:max-w-16 max-[400px]:max-w-12`}
                    alt="logo"
                  />
                  <span className="break-words">{item.label}</span>
                </Link>
              );
            } else {
              return (
                <a
                  key={item.href}
                  // href={item.href}
                  onClick={() => handleMenuItemClick(item)}
                  className={`relative cursor-pointer ${
                    isActive ? "active" : "hover:scale-105 hover:border  transition-transform duration-300"
                  } bg-clip-padding [&.active]:after:rounded-lg [&.active]:after:contents[''] [&.active]:after:absolute [&.active]:after:-inset-[2px] [&.active]:after:-z-[1] [&.active]:after:bg-profileBorderGradient [&.active]:before:content-[''] [&.active]:before:absolute [&.active]:before:inset-0 [&.active]:before:w-full [&.active]:before:h-full [&.active]:before:bg-profileActiveBg [&.active]:before:bg-no-repeat [&.active]:before:bg-right-bottom [&.active>span]:text-white [&.active>span]:font-bold inset-0 border-2 border-solid border-transparent flex items-center   text-base leading-[1.2] break-words max-nlg:text-base max-nlg:leading-[1.2] max-xl:leading-[1.2] max-md:text-[13px] font-normal w-full   rounded-lg py-1 px-2.5 gap-2 capitalize `}
                >
                  <Image
                    src={item.icon}
                    width={80}
                    height={80}
                    className={`w-[4.1875rem] rounded-full ${
                      isActive ? "" : "grayscale hover:scale-105 hover:border  "
                    } max-md:max-w-16 max-[400px]:max-w-12`}
                    alt="logo"
                  />
                  <span className="break-words">{item.label}</span>
                </a>
              );
            }
          })}
      </div>
      <button
        onClick={handleLogout}
        className="text-white flex items-center gap-2.5 text-base capitalize mt-5 hover:font-semibold transition-transform duration-300"
      >
        <span>logout</span>
        <Image src={logoutIconWhite} alt={logout} width="20" height="20" />
      </button>
    </div>
  );
}

export default ProfileSidebar;
