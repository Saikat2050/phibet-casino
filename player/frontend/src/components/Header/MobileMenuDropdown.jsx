"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@/assets/images/menuBottom/HomeIcon";
import HomeActiveIcon from "@/assets/images/menuBottom/HomeActive";
import LobbyIcon from "@/assets/images/menuBottom/LobbyIcon";
import LobbyActiveIcon from "@/assets/images/menuBottom/LobbyActive";
import UserActiveIcon from "@/assets/images/menuBottom/UserActive";
import UserIcon from "@/assets/images/menuBottom/UserIcon";
import DownArrowIcon from "../../../public/assets/img/svg/DownArrowIcon";
import PromoIcon from '@/assets/images/menuBottom/PromoIcon';
import ShowCoinPackageMoal from '../ShowCoinsPackagesModal';
import CompleteYourProfileModal from '../CompleteYourProfileModal';
import useModalsStore from '@/store/useModalsStore';
import useUserStore from '@/store/useUserStore';
import { getCookie } from "@/utils/clientCookieUtils";

const MobileMenuDropdown = ({ userPackages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { openModal } = useModalsStore();
  const { user } = useUserStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Try getting the token with a try-catch to handle any errors
  let userToken = null;
  try {
    userToken = getCookie("accessToken");
  } catch (error) {
    console.log("Error getting cookie:", error);
  }

  // Early return if authentication check fails or component is not mounted
  if (!isMounted || !userToken || (user && user.isEmailVerified === false)) {
    return null;
  }

  const handleBuyCoinsClick = () => {
    const hasIncompleteProfile = user?.profileCompleted === false || user?.phoneVerified === false;

    if (hasIncompleteProfile) {
      openModal(<CompleteYourProfileModal close={true} />);
    } else {
      openModal(<ShowCoinPackageMoal close={true} CoinsPackages={userPackages} />);
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      href: "/",
      label: "Home",
      icon: <HomeIcon />,
      activeIcon: <HomeActiveIcon />,
    },
    {
      href: "/user",
      label: "Menu",
      icon: <LobbyIcon />,
      activeIcon: <LobbyActiveIcon />,
    },
    {
      href: "/user/profile",
      label: "My Account",
      icon: <UserIcon />,
      activeIcon: <UserActiveIcon />,
    },
    {
      label: "Buy Coins",
      icon: <PromoIcon />,
      activeIcon: <PromoIcon />,
      onClick: handleBuyCoinsClick,
    },
  ];

  return (
    <div className="relative sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white"
      >
        <LobbyIcon className="w-4 h-4" />
        <DownArrowIcon className={`w-3 h-3 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-36   rounded-lg shadow-lg py-2 z-50">
          {menuItems.map(({ href, label, icon, activeIcon, onClick }) => {
            const isActive = pathname === href;
            const content = (
              <div
                className={`flex items-center gap-3 px-2 py-2 hover:  transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white'
                } cursor-pointer`}
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }
                  setIsOpen(false);
                }}
              >
                {isActive ? activeIcon : icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
            );

            if (href) {
              return (
                <Link key={label} href={href}>
                  {content}
                </Link>
              );
            }

            return <div key={label}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
};

export default MobileMenuDropdown;