"use client";
import RegionRestrictedModal from "@/components/Common/RegionRestrictedModal";
import useModalsStore from "@/store/useModalsStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import React from "react";
import BlockedImage from "@/assets/images/blocked.png";
import Image from "next/image";
import logo from "@/assets/images/logo/logo.svg";

const Page = () => {
  const { openModal, clearModals } = useModalsStore();
  const router = useRouter();

  useEffect(() => {
    clearModals();
    openModal(<RegionRestrictedModal />);

    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.href);

      window.onpopstate = function () {
        window.history.pushState(null, null, window.location.href);
      };
    };

    preventBackNavigation();

    return () => {
      window.onpopstate = null;
    };
  }, [clearModals, openModal]);

  return null;
};

export default Page;
