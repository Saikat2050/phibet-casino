"use client";
import HomeIcon from "@/assets/images/menuBottom/HomeIcon";
import HomeActiveIcon from "@/assets/images/menuBottom/HomeActive";
import LobbyIcon from "@/assets/images/menuBottom/LobbyIcon";
import LobbyActiveIcon from "@/assets/images/menuBottom/LobbyActive";
import UserActiveIcon from "@/assets/images/menuBottom/UserActive";
import PromoIcon from "@/assets/images/menuBottom/PromoIcon";
import UserIcon from "@/assets/images/menuBottom/UserIcon";
import Link from "next/link";
import BuyCoinMobileComponent from "./BuyCoinMobileComponent";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BottomMenu = ({ userPackages }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/",
      label: "Home",
      icon: <HomeIcon />,
      activeIcon: <HomeActiveIcon />,
      tabIndex: 0,
    },
    {
      href: "/user",
      label: "Menu",
      icon: <LobbyIcon />,
      activeIcon: <LobbyActiveIcon />,
      tabIndex: 1,
    },
    {
      href: "/user/profile",
      label: "My Account",
      icon: <UserIcon />,
      activeIcon: <UserActiveIcon />,
      tabIndex: 2,
    },
  ];

  useEffect(() => {
    menuItems.filter((item) => {
      if (pathname.includes(item.href)) {
        setActiveTab(item.tabIndex);
      }
    });
  }, [pathname]);

  // Handle tab click to set the active tab
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="px-5 py-2 max-sm:px-2 z-[999] text-white grid grid-cols-4 md:hidden min-h-[70px] fixed left-0 bottom-0 w-full rounded-t-lg bg-mobileMenuBottom bg-cover bg-center">
      {menuItems.map(({ href, label, icon, tabIndex, activeIcon }) => (
        <Link
          key={tabIndex}
          href={href}
          className={`text-center font-bold text-[13px] leading-[18px] flex flex-col items-center justify-center gap-y-2 ${
            activeTab === tabIndex ? "" : ""
          }`}
          onClick={() => handleTabClick(tabIndex)}
        >
          {activeTab === tabIndex ? activeIcon : icon}
          <p className={`mb-1 ${activeTab === tabIndex ? "text-white" : ""}`}>
            {label}
          </p>
        </Link>
      ))}
      <BuyCoinMobileComponent userPackages={userPackages} />
    </div>
  );
};

export default BottomMenu;
