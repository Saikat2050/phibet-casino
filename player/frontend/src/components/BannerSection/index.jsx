"use client";

import React, { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import HeroSlider from "./BannerSideSection";
import { getCookie } from "@/utils/clientCookieUtils";

const BannerSection = ({ }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    user,
  } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const userToken = getCookie("accessToken");
      if (userToken && user?.isEmailVerified) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      // setIsLoading(false);
    };

    fetchUserData();
  }, [user]);


  return (
    <div className={`pb-20 ${isAuthenticated ? "" : ""}`}>
      <HeroSlider />
    </div>
  );
};

export default BannerSection;
