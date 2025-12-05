"use client";

import { useEffect, useState } from "react";
import BottomMenu from "./BottomMenu";
import { getPackages } from "@/actions";
import useUserStore from "@/store/useUserStore";
import { deleteAllClientCookies, getCookie } from "@/utils/clientCookieUtils";
const BottomMenuWrapper = () => {
  const { isLoggedIn,user } = useUserStore();
  const [userPackages, setUserPackages] = useState(null);
  const userToken = getCookie("accessToken");
  useEffect(() => {
    if (isLoggedIn) {
      getPackages().then((packages) => {
        setUserPackages(packages);
      });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;
  if(!userToken || (userToken && user?.isEmailVerified == false)) return null;

  return <BottomMenu userPackages={userPackages} />;
};

export default BottomMenuWrapper;
